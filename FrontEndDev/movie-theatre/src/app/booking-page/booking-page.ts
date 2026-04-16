import { Component, OnInit } from '@angular/core';
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
export class BookingPage implements OnInit {

  private readonly draftStorageKey = 'bookingDraft';

  movie$!: Observable<Movie>;

  // Showtime & seat map (loaded from DB)
  showtimeId!: number;
  showtime: ShowtimeResponse | null = null;
  seatMapLoading = false;
  seatMapError = '';

  adult = 0;
  child = 0;
  senior = 0;
  selectedSeats: string[] = [];

  displayDialog = false;
  paymentDialog = false;
  paymentSuccessDialog = false;

  checkoutEmail = '';
  checkoutError = '';
  paymentError = '';
  paymentProcessing = false;
  completedBooking: BookingRecord | null = null;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService,
    private profileService: ProfileService,
    private movieService: MovieService,
    private showtimeService: ShowtimeService
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
      }
    });

    this.restoreBookingDraft();
    this.checkoutEmail = this.authService.getCurrentUser()?.email || '';
    this.loadStoredCards();
  }

  // Load seat map from the backend for this specific showtime
  loadSeatMap(): void {
    this.seatMapLoading = true;
    this.seatMapError = '';
    this.showtimeService.getShowtimeById(this.showtimeId).subscribe({
      next: st => {
        this.showtime = st;
        this.seatMapLoading = false;
      },
      error: () => {
        this.seatMapError = 'Unable to load seat map. Please go back and try again.';
        this.seatMapLoading = false;
      }
    });
  }

  get totalTickets(): number {
    return (this.adult || 0) + (this.child || 0) + (this.senior || 0);
  }

  get subtotal(): number {
    return (this.adult || 0) * 5 + (this.child || 0) * 2.5 + (this.senior || 0) * 3.5;
  }

  get estimatedTax(): number {
    return Number((this.subtotal * this.taxRate).toFixed(2));
  }

  get totalWithTax(): number {
    return Number((this.subtotal + this.estimatedTax).toFixed(2));
  }

  get hasStoredCards(): boolean {
    return this.storedCards.length > 0;
  }

  get canSaveCard(): boolean {
    return this.storedCards.length < 3;
  }

  get ticketSummary(): string {
    return [
      { label: 'Adult', count: this.adult || 0, price: 5 },
      { label: 'Child', count: this.child || 0, price: 2.5 },
      { label: 'Senior', count: this.senior || 0, price: 3.5 }
    ]
      .filter(t => t.count > 0)
      .map(t => `${t.count} ${t.label} @ $${t.price.toFixed(2)}`)
      .join(', ');
  }

  get selectedSeatsLabel(): string {
    return this.selectedSeats.length ? this.selectedSeats.join(', ') : 'None';
  }

  // Returns rows A-C (7 seats) and D-E (5 seats) from the loaded seat map
  get rowsABC(): SeatInfo[][] {
    if (!this.showtime) return [];
    return ['A', 'B', 'C'].map(row =>
      (this.showtime!.seats || []).filter(s => s.seatNumber.startsWith(row))
        .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
    );
  }

  get rowsDE(): SeatInfo[][] {
    if (!this.showtime) return [];
    return ['D', 'E'].map(row =>
      (this.showtime!.seats || []).filter(s => s.seatNumber.startsWith(row))
        .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
    );
  }

  selectSeat(seat: SeatInfo): void {
    if (seat.booked) return; // already booked — blocked
    if (this.selectedSeats.includes(seat.seatNumber)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat.seatNumber);
    } else if (this.selectedSeats.length < this.totalTickets) {
      this.selectedSeats.push(seat.seatNumber);
    }
  }

  isSelected(seatNumber: string): boolean {
    return this.selectedSeats.includes(seatNumber);
  }

  isDisabled(seat: SeatInfo): boolean {
    if (seat.booked) return true;
    return !this.selectedSeats.includes(seat.seatNumber) &&
      this.selectedSeats.length >= this.totalTickets;
  }

  private resolveCardholderName(): string {
    if (this.useSavedCard && this.storedCards.length > 0 && this.selectedCardId) {
      const card = this.storedCards.find(c => c.id === this.selectedCardId);
      return card?.cardHolderName || '';
    }
    return this.paymentName.trim();
  }

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

    this.checkoutEmail = this.checkoutEmail || this.authService.getCurrentUser()?.email || '';
    this.displayDialog = true;
  }

  continueToPayment(): void {
    this.checkoutError = '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.checkoutEmail.trim())) {
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
    if (!/^\d{3,4}$/.test(this.onlyDigits(this.paymentCvv))) {
      this.paymentError = 'Enter a valid CVV (3 or 4 digits).'; return;
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

    const showDate = this.showtime
      ? this.showtime.showDate
      : '';
    const showTime = this.showtime
      ? this.showtime.showTime.substring(0, 5)  // HH:mm from HH:mm:ss
      : '';

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

        if (!usingStoredCard && this.saveCardForFuture && userId) {
          this.saveManualCardToAccount(userId, this.paymentName.trim(),
            sanitizedCardNumber, formattedExpiry, sanitizedZip);
        }

        this.paymentDialog = false;
        setTimeout(() => { this.paymentSuccessDialog = true; });
        sessionStorage.removeItem(this.draftStorageKey);
        this.resetBookingForm();
        this.loadStoredCards();
        // Refresh seat map to reflect newly booked seats
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
      selectedSeats: this.selectedSeats, checkoutEmail: this.checkoutEmail
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
    } catch { sessionStorage.removeItem(this.draftStorageKey); }
  }

  private resetBookingForm(): void {
    this.adult = 0; this.child = 0; this.senior = 0;
    this.selectedSeats = [];
    this.paymentCvv = '';
    this.saveCardForFuture = false;
    if (!this.useSavedCard) {
      this.paymentName = ''; this.paymentCardNumber = '';
      this.paymentExpiryDate = null; this.paymentZip = '';
    }
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