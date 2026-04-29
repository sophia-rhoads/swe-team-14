import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

import { MovieService } from '../services/movie.services';
import { ShowtimeService, ShowtimeResponse, SeatInfo } from '../services/showtime.services';
import { AuthService } from '../services/auth.services';
import { BookingRecord, BookingService } from '../services/booking.services';
import { ProfileService, PaymentCard, AddCardRequest } from '../services/profile.service';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, RatingModule,
    ProgressSpinnerModule, InputNumberModule,
    DatePickerModule, DialogModule, InputTextModule, CheckboxModule
  ],
  templateUrl: './booking-page.html',
  styleUrls: ['./booking-page.scss']
})
export class BookingPage implements OnInit, OnDestroy {

  private readonly draftStorageKey = 'bookingDraft';

  movie$!: Observable<Movie>;

  showtimeId!: number;
  showtime: ShowtimeResponse | null = null;
  seatMapLoading = false;
  seatMapError = '';

  adult = 0;
  child = 0;
  senior = 0;
  selectedSeats: string[] = [];

  // Seats that are temporarily locked by OTHER users
  lockedByOthers: Set<string> = new Set();

  displayDialog = false;
  paymentDialog = false;
  paymentSuccessDialog = false;

  checkoutEmail = '';
  checkoutError = '';
  paymentError = '';
  paymentProcessing = false;
  completedBooking: BookingRecord | null = null;
  promoCode = '';
  appliedPromoCode = '';
  promoMessage = '';
  promoMessageType: 'success' | 'error' = 'success';

  // Manual card fields
  paymentName = '';
  paymentCardNumber = '';
  paymentExpiryDate: Date | null = null;
  paymentCvv = '';
  paymentZip = '';
  saveCardForFuture = false;

  storedCards: PaymentCard[] = [];
  selectedCardId: number | null = null;
  useSavedCard = true;

  readonly taxRate = 0.07;

  // Seat lock / checkout timer state 
  // Session token returned by the backend when seats are locked
  seatSessionToken: string | null = null;

  // When the current lock expires (ISO string from backend)
  lockExpiresAt: Date | null = null;

  // Seconds remaining on the 5-minute checkout timer
  timerSeconds = 0;

  // Whether the timer is actively counting down
  timerActive = false;

  // Whether the lock has expired and the user needs to re-select seats
  lockExpired = false;

  private gracePeriodEndAt: Date | null = null;
  private readonly GRACE_MINUTES = 3;

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private lockedSeatsPollInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService,
    private profileService: ProfileService,
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => this.movieService.getMovieById(Number(params.get('id'))))
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const showtimeIdParam = params.get('showtime');
      if (showtimeIdParam) {
        this.showtimeId = Number(showtimeIdParam);
        this.loadSeatMap();
        this.startLockedSeatsPoll();
      }
    });

    this.restoreBookingDraft();
    this.checkoutEmail = this.authService.getCurrentUser()?.email || '';
    this.loadStoredCards();

    // If returning within the grace window, try to re-acquire the previous locks
    this.tryGraceWindowRestore();
  }

  ngOnDestroy(): void {
    this.clearTimerInterval();
    this.stopLockedSeatsPoll();

    // If the user navigates away without paying, release their locks —
    // BUT first save a grace-window record so they can reclaim within 3 min
    if (this.seatSessionToken && !this.completedBooking) {
      this.saveGraceWindow();
      this.showtimeService.releaseLocks(this.seatSessionToken).subscribe();
      this.seatSessionToken = null;
    }
  }

  loadSeatMap(): void {
    this.seatMapLoading = true;
    this.seatMapError = '';
    this.showtimeService.getShowtimeById(this.showtimeId).subscribe({
      next: st => {
        this.showtime = st;
        this.seatMapLoading = false;
        this.refreshLockedSeats();
      },
      error: () => {
        this.seatMapError = 'Unable to load seat map. Please go back and try again.';
        this.seatMapLoading = false;
      }
    });
  }

  // Timer helpers
  get timerDisplay(): string {
    const m = Math.floor(this.timerSeconds / 60);
    const s = this.timerSeconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  get timerUrgent(): boolean {
    return this.timerSeconds <= 60 && this.timerActive;
  }

  private startTimer(expiresAt: Date): void {
    this.clearTimerInterval();
    this.lockExpired = false;
    this.timerActive = true;
    this.lockExpiresAt = expiresAt;

    this.timerSeconds = Math.max(0,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000));

    this.ngZone.runOutsideAngular(() => {
      this.timerInterval = setInterval(() => {
        const remaining = Math.max(0,
          Math.floor((this.lockExpiresAt!.getTime() - Date.now()) / 1000));

        if (remaining !== this.timerSeconds) {
          this.timerSeconds = remaining;
          this.cdr.detectChanges();
        }

        if (remaining <= 0) {
          this.clearTimerInterval();
          this.ngZone.run(() => {
            this.timerActive = false;
            this.lockExpired = true;
            this.seatSessionToken = null;
            this.selectedSeats = [];
            this.displayDialog = false;
            this.paymentDialog = false;
            this.refreshLockedSeats();
            this.cdr.detectChanges();
          });
        }
      }, 250);
    });
  }

  private clearTimerInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Locked-seats overlay
  private startLockedSeatsPoll(): void {
    this.lockedSeatsPollInterval = setInterval(() => {
      this.refreshLockedSeats();
    }, 20_000);
  }

  private stopLockedSeatsPoll(): void {
    if (this.lockedSeatsPollInterval) {
      clearInterval(this.lockedSeatsPollInterval);
      this.lockedSeatsPollInterval = null;
    }
  }

  private refreshLockedSeats(): void {
    if (!this.showtimeId) return;
    this.showtimeService.getLockedSeats(this.showtimeId).subscribe({
      next: res => {
        const mySeats = new Set(this.selectedSeats);
        this.lockedByOthers = new Set(
          res.lockedSeats.filter(s => !mySeats.has(s))
        );
      },
      error: () => { /* non-critical — keep previous state */ }
    });
  }

  // Seat selection + locking
  selectSeat(seat: SeatInfo): void {
    if (seat.booked) return;
    if (this.lockedByOthers.has(seat.seatNumber)) return;

    if (this.selectedSeats.includes(seat.seatNumber)) {
      // Deselect
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat.seatNumber);
      // If all seats deselected, release locks and stop timer
      if (this.selectedSeats.length === 0 && this.seatSessionToken) {
        this.showtimeService.releaseLocks(this.seatSessionToken).subscribe();
        this.seatSessionToken = null;
        this.clearTimerInterval();
        this.timerActive = false;
        this.lockExpired = false;
      }
    } else if (this.selectedSeats.length < this.totalTickets) {
      this.selectedSeats.push(seat.seatNumber);

      // Acquire a lock as soon as the selection is complete
      if (this.selectedSeats.length === this.totalTickets) {
        this.acquireSeatLocks();
      }
    }
  }

  private acquireSeatLocks(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;   // not logged in yet — lock deferred to proceedToCheckout

    // Release any existing lock before acquiring a new one
    if (this.seatSessionToken) {
      this.showtimeService.releaseLocks(this.seatSessionToken).subscribe();
      this.seatSessionToken = null;
    }

    this.showtimeService.lockSeats({
      showtimeId: this.showtimeId,
      seatNumbers: [...this.selectedSeats],
      userId
    }).subscribe({
      next: res => {
        this.seatSessionToken = res.sessionToken;
        this.startTimer(new Date(res.expiresAt));
        this.lockExpired = false;
        this.refreshLockedSeats();
      },
      error: err => {
        const msg = typeof err?.error === 'string' ? err.error
          : 'One or more selected seats were just taken. Please reselect.';
        this.checkoutError = msg;
        // Deselect the conflicting seat(s) and refresh
        this.selectedSeats = [];
        this.refreshLockedSeats();
        this.loadSeatMap();
      }
    });
  }

  // Grace window
  private saveGraceWindow(): void {
    if (!this.selectedSeats.length || !this.seatSessionToken) return;
    const graceEnd = new Date(Date.now() + this.GRACE_MINUTES * 60 * 1000);
    sessionStorage.setItem('seatGrace', JSON.stringify({
      showtimeId: this.showtimeId,
      seats: this.selectedSeats,
      token: this.seatSessionToken,
      graceEnd: graceEnd.toISOString()
    }));
  }

  private tryGraceWindowRestore(): void {
    const raw = sessionStorage.getItem('seatGrace');
    if (!raw) return;
    try {
      const g = JSON.parse(raw);
      if (g.showtimeId !== this.showtimeId) return;
      if (new Date(g.graceEnd) < new Date()) {
        sessionStorage.removeItem('seatGrace');
        return;
      }
      // Grace window is still valid — restore selection and re-acquire locks
      this.selectedSeats = g.seats;
      sessionStorage.removeItem('seatGrace');
      this.acquireSeatLocks();
    } catch {
      sessionStorage.removeItem('seatGrace');
    }
  }

  // Seat state helpers
  isSelected(seatNumber: string): boolean {
    return this.selectedSeats.includes(seatNumber);
  }

  isLockedByOther(seatNumber: string): boolean {
    return this.lockedByOthers.has(seatNumber);
  }

  isDisabled(seat: SeatInfo): boolean {
    if (seat.booked) return true;
    if (this.lockedByOthers.has(seat.seatNumber)) return true;
    return !this.selectedSeats.includes(seat.seatNumber) &&
      this.selectedSeats.length >= this.totalTickets;
  }

  // Computed values
  get totalTickets(): number {
    return (this.adult || 0) + (this.child || 0) + (this.senior || 0);
  }

  get subtotal(): number {
    return (this.adult || 0) * 5 + (this.child || 0) * 2.5 + (this.senior || 0) * 3.5;
  }

  get estimatedTax(): number {
    return Number((this.discountedSubtotal * this.taxRate).toFixed(2));
  }

  get totalWithTax(): number {
    return Number((this.discountedSubtotal + this.estimatedTax).toFixed(2));
  }

  get normalizedPromoInput(): string {
    return this.promoCode.trim().toUpperCase();
  }

  get discountAmount(): number {
    return this.promoDiscountFor(this.appliedPromoCode).amount;
  }

  get discountedSubtotal(): number {
    return Number(Math.max(0, this.subtotal - this.discountAmount).toFixed(2));
  }

  get hasStoredCards(): boolean { return this.storedCards.length > 0; }
  get canSaveCard(): boolean { return this.storedCards.length < 3; }

  get ticketSummary(): string {
    return [
      { label: 'Adult', count: this.adult || 0, price: 5 },
      { label: 'Child', count: this.child || 0, price: 2.5 },
      { label: 'Senior', count: this.senior || 0, price: 3.5 }
    ].filter(t => t.count > 0)
      .map(t => `${t.count} ${t.label} @ $${t.price.toFixed(2)}`)
      .join(', ');
  }

  get selectedSeatsLabel(): string {
    return this.selectedSeats.length ? this.selectedSeats.join(', ') : 'None';
  }

  get rowsABC(): SeatInfo[][] {
    if (!this.showtime) return [];
    return ['A', 'B', 'C'].map(row =>
      (this.showtime!.seats || [])
        .filter(s => s.seatNumber.startsWith(row))
        .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
    );
  }

  get rowsDE(): SeatInfo[][] {
    if (!this.showtime) return [];
    return ['D', 'E'].map(row =>
      (this.showtime!.seats || [])
        .filter(s => s.seatNumber.startsWith(row))
        .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
    );
  }

  // Checkout flow
  proceedToCheckout(movie: Movie): void {
    this.checkoutError = '';

    if (movie.status === 'COMING_SOON') {
      this.checkoutError = 'Ticket booking is not available because this movie is coming soon.';
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.persistBookingDraft(movie.id);
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/booking/${movie.id}/${this.showtimeId}` }
      });
      return;
    }

    if (this.totalTickets === 0 || this.selectedSeats.length !== this.totalTickets) {
      this.checkoutError = 'Select ticket quantities and matching seats before proceeding.';
      return;
    }

    if (this.lockExpired) {
      this.checkoutError = 'Your seat reservation expired. Please reselect your seats.';
      return;
    }

    // If seats are selected but lock wasn't acquired yet
    if (!this.seatSessionToken) {
      this.acquireSeatLocks();
      this.checkoutError = 'Reserving your seats... please try again in a moment.';
      return;
    }

    this.checkoutEmail = this.checkoutEmail || this.authService.getCurrentUser()?.email || '';
    this.displayDialog = true;
  }

  continueToPayment(): void {
    this.checkoutError = '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.checkoutEmail.trim())) {
      this.checkoutError = 'Enter a valid email address for the order confirmation.';
      return;
    }
    this.displayDialog = false;
    this.paymentProcessing = false;
    this.paymentDialog = true;
  }

  submitPayment(movie: Movie): void {
    this.paymentError = '';

    const userId = this.authService.getUserId();
    if (!userId) { this.paymentError = 'Please log in again before completing payment.'; return; }

    if (this.lockExpired) {
      this.paymentError = 'Your seat reservation expired. Please close this dialog and reselect your seats.';
      return;
    }

    if (!/^\d{3,4}$/.test(this.onlyDigits(this.paymentCvv))) {
      this.paymentError = 'Enter a valid CVV (3 or 4 digits).'; return;
    }

    if (this.normalizedPromoInput && this.normalizedPromoInput !== this.appliedPromoCode) {
      this.paymentError = 'Click Apply to validate the promo code before payment, or clear the field.';
      return;
    }

    const usingStoredCard = this.useSavedCard && this.storedCards.length > 0;
    if (usingStoredCard && !this.selectedCardId) {
      this.paymentError = 'Choose one of your saved cards.'; return;
    }

    const sanitizedCardNumber = this.onlyDigits(this.paymentCardNumber);
    const sanitizedZip = this.onlyDigits(this.paymentZip).slice(0, 5);
    const formattedExpiry = this.formatExpiryMonth(this.paymentExpiryDate);

    if (!usingStoredCard) {
      if (!this.paymentName.trim()) { this.paymentError = 'Enter the cardholder name.'; return; }
      if (!/^\d{16}$/.test(sanitizedCardNumber)) { this.paymentError = 'Enter a valid 16-digit card number.'; return; }
      if (!formattedExpiry) { this.paymentError = 'Choose a valid expiry month.'; return; }
      if (!/^\d{5}$/.test(sanitizedZip)) { this.paymentError = 'Enter a valid 5-digit billing ZIP code.'; return; }
    }

    const showDate = this.showtime ? this.showtime.showDate : '';
    const showTime = this.showtime ? this.showtime.showTime.substring(0, 5) : '';

    const payload = {
      userId,
      movieId: movie.id,
      showtimeId: this.showtimeId,
      showDate,
      showTime,
      adultTickets: this.adult || 0,
      childTickets: this.child || 0,
      seniorTickets: this.senior || 0,
      seatNumbers: [...this.selectedSeats],
      confirmationEmail: this.checkoutEmail.trim(),
      sessionToken: this.seatSessionToken,   // send token so backend can release locks
      promoCode: this.appliedPromoCode || null,
      payment: {
        paymentCardId: usingStoredCard ? this.selectedCardId : null,
        cardholderName: this.resolveCardholderName(),
        cardNumber: sanitizedCardNumber,
        expiryDate: formattedExpiry,
        cvv: this.onlyDigits(this.paymentCvv).slice(0, 4),
        billingZipCode: sanitizedZip
      }
    };

    this.paymentProcessing = true;
    this.bookingService.checkout(payload).subscribe({
      next: booking => {
        this.paymentProcessing = false;
        this.completedBooking = booking;
        this.clearTimerInterval();
        this.timerActive = false;
        this.seatSessionToken = null;

        if (!usingStoredCard && this.saveCardForFuture && userId) {
          this.saveManualCardToAccount(userId, this.paymentName.trim(),
            sanitizedCardNumber, formattedExpiry, sanitizedZip);
        }

        this.paymentDialog = false;
        setTimeout(() => { this.paymentSuccessDialog = true; });
        sessionStorage.removeItem(this.draftStorageKey);
        sessionStorage.removeItem('seatGrace');
        this.resetBookingForm();
        this.loadStoredCards();
        this.loadSeatMap();
      },
      error: err => {
        this.paymentProcessing = false;
        const raw: string = typeof err?.error === 'string' ? err.error : err?.error?.message || '';
        this.paymentError = raw.startsWith('PAYMENT_DECLINED:')
          ? raw.replace('PAYMENT_DECLINED:', '').trim()
          : (raw || 'Payment could not be completed. Please try again.');
      }
    });
  }

  private resolveCardholderName(): string {
    if (this.useSavedCard && this.storedCards.length > 0 && this.selectedCardId) {
      return this.storedCards.find(c => c.id === this.selectedCardId)?.cardHolderName || '';
    }
    return this.paymentName.trim();
  }

  private saveManualCardToAccount(userId: number, cardHolderName: string,
    cardNumber: string, expirationDate: string, billingZipCode: string): void {
    const req: AddCardRequest = {
      cardHolderName,
      cardType: this.detectCardBrand(cardNumber),
      cardNumber,
      expirationDate,
      billingZipCode
    };
    this.profileService.addCard(userId, req).subscribe({
      next: () => this.loadStoredCards(),
      error: () => { /* silent — payment already succeeded */ }
    });
  }

  closeSuccessDialog(): void {
    this.paymentSuccessDialog = false;
    this.completedBooking = null;
    this.router.navigate(['/']);
  }

  selectSavedCard(cardId: number): void {
    this.selectedCardId = cardId;
    this.useSavedCard = true;
    this.paymentError = '';
  }

  switchPaymentMode(useSavedCard: boolean): void {
    this.useSavedCard = useSavedCard;
    this.paymentError = '';
    if (useSavedCard) this.saveCardForFuture = false;
  }

  applyPromoCode(): void {
    const code = this.normalizedPromoInput;
    const promo = this.promoDiscountFor(code);

    if (!code) {
      this.appliedPromoCode = '';
      this.promoMessage = '';
      return;
    }

    if (promo.error) {
      this.appliedPromoCode = '';
      this.promoMessage = promo.error;
      this.promoMessageType = 'error';
      return;
    }

    this.appliedPromoCode = code;
    this.promoMessage = `Success: valid promo code applied. You saved $${promo.amount.toFixed(2)}.`;
    this.promoMessageType = 'success';
  }

  onPromoCodeInput(): void {
    this.promoMessage = '';
    this.paymentError = '';
    if (this.normalizedPromoInput !== this.appliedPromoCode) {
      this.appliedPromoCode = '';
    }
  }

  maskCard(cardNumber: string): string {
    return `**** **** **** ${cardNumber.replace(/\s+/g, '').slice(-4)}`;
  }

  formatPaymentCardNumberInput(): void { this.paymentCardNumber = this.groupCardNumber(this.paymentCardNumber); }
  formatPaymentZipInput(): void { this.paymentZip = this.onlyDigits(this.paymentZip).slice(0, 5); }
  formatPaymentCvvInput(): void { this.paymentCvv = this.onlyDigits(this.paymentCvv).slice(0, 4); }

  private detectCardBrand(n: string): string {
    if (n.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'American Express';
    return 'Card';
  }

  private loadStoredCards(): void {
    const userId = this.authService.getUserId();
    if (!userId) { this.storedCards = []; return; }
    this.profileService.getCards(userId).subscribe({
      next: cards => {
        this.storedCards = cards;
        if (cards.length > 0) {
          this.selectedCardId = cards.some(c => c.id === this.selectedCardId)
            ? this.selectedCardId : cards[0].id;
          this.useSavedCard = true;
        } else {
          this.selectedCardId = null;
          this.useSavedCard = false;
        }
      },
      error: () => { this.storedCards = []; this.selectedCardId = null; this.useSavedCard = false; }
    });
  }

  private persistBookingDraft(movieId: number): void {
    sessionStorage.setItem(this.draftStorageKey, JSON.stringify({
      movieId, showtimeId: this.showtimeId,
      adult: this.adult, child: this.child, senior: this.senior,
      selectedSeats: this.selectedSeats, checkoutEmail: this.checkoutEmail,
      promoCode: this.promoCode,
      appliedPromoCode: this.appliedPromoCode
    }));
  }

  private restoreBookingDraft(): void {
    const raw = sessionStorage.getItem(this.draftStorageKey);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      const routeMovieId = Number(this.route.snapshot.paramMap.get('id'));
      if (d.movieId !== routeMovieId) return;
      this.adult = d.adult ?? 0;
      this.child = d.child ?? 0;
      this.senior = d.senior ?? 0;
      this.selectedSeats = Array.isArray(d.selectedSeats) ? d.selectedSeats : [];
      this.checkoutEmail = d.checkoutEmail || '';
      this.promoCode = d.promoCode || '';
      this.appliedPromoCode = d.appliedPromoCode || '';
    } catch { sessionStorage.removeItem(this.draftStorageKey); }
  }

  private resetBookingForm(): void {
    this.adult = 0; this.child = 0; this.senior = 0;
    this.selectedSeats = [];
    this.paymentCvv = '';
    this.saveCardForFuture = false;
    this.promoCode = '';
    this.appliedPromoCode = '';
    this.promoMessage = '';
    if (!this.useSavedCard) {
      this.paymentName = ''; this.paymentCardNumber = '';
      this.paymentExpiryDate = null; this.paymentZip = '';
    }
  }

  private promoDiscountFor(code: string): { amount: number; error?: string } {
    if (!code) return { amount: 0 };

    switch (code) {
      case 'SAVE5':
        return { amount: this.roundMoney(this.subtotal * 0.05) };
      case 'SAVE7':
        return { amount: this.roundMoney(this.subtotal * 0.07) };
      case 'SAVE10':
        return { amount: this.roundMoney(this.subtotal * 0.10) };
      case 'OVER25':
        return this.subtotal >= 25
          ? { amount: 2 }
          : { amount: 0, error: 'OVER25 requires a subtotal of at least $25.00.' };
      case 'OVER50':
        return this.subtotal >= 50
          ? { amount: 12 }
          : { amount: 0, error: 'OVER50 requires a subtotal of at least $50.00.' };
      default:
        return { amount: 0, error: 'Invalid promo code. Please check the code and try again.' };
    }
  }

  private roundMoney(value: number): number {
    return Number(value.toFixed(2));
  }

  private formatExpiryMonth(date: Date | null): string {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private onlyDigits(v: string): string { return String(v || '').replace(/\D/g, ''); }

  private groupCardNumber(v: string): string {
    return this.onlyDigits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }
}
