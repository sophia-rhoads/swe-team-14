import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { MovieService } from '../services/movie.services';
import { AuthService } from '../services/auth.services';
import { BookingRecord, BookingService } from '../services/booking.services';
import { ProfileService, PaymentCard } from '../services/profile.service';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, RatingModule,
    ProgressSpinnerModule, RadioButtonModule, InputNumberModule,
    DatePickerModule, DialogModule, InputTextModule
  ],
  templateUrl: './booking-page.html',
  styleUrls: ['./booking-page.scss']
})
export class BookingPage implements OnInit {

  private readonly draftStorageKey = 'bookingDraft';

  movie$!: Observable<Movie>;
  showTimes!: string;
  selectedDate!: Date;
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

  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

  paymentName = '';
  paymentCardNumber = '';
  paymentExpiryDate: Date | null = null;
  paymentCvv = '';
  paymentZip = '';

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
    private movieService: MovieService
  ) {
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => this.movieService.getMovieById(Number(params.get('id'))))
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const passedShowtime = params.get('showtime');
      if (passedShowtime) this.showTimes = passedShowtime;
    });

    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.selectedDate = new Date(params['date']);
        this.selectedDate.setHours(0, 0, 0, 0);
      }
    });

    const stateDate = history.state?.date;
    if (!this.selectedDate && stateDate) {
      this.selectedDate = new Date(stateDate);
      this.selectedDate.setHours(0, 0, 0, 0);
    }

    this.restoreBookingDraft();
    this.checkoutEmail = this.authService.getCurrentUser()?.email || '';
    this.loadStoredCards();
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

  private resolveCardholderName(): string {
    if (this.useSavedCard && this.storedCards.length > 0 && this.selectedCardId) {
      const card = this.storedCards.find(c => c.id === this.selectedCardId);
      return card?.cardHolderName || '';
    }
    return this.paymentName.trim();
  }

  selectSeat(seat: string): void {
    if (this.selectedSeats.includes(seat)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
    } else if (this.selectedSeats.length < this.totalTickets) {
      this.selectedSeats.push(seat);
    }
  }

  isSelected(seat: string): boolean {
    return this.selectedSeats.includes(seat);
  }

  isDisabled(seat: string): boolean {
    return !this.selectedSeats.includes(seat) && this.selectedSeats.length >= this.totalTickets;
  }

  proceedToCheckout(movie: Movie): void {
    this.checkoutError = '';

    if (movie.status === 'COMING_SOON') {
      this.checkoutError = 'Ticket booking is not available because this movie is coming soon.';
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.persistBookingDraft(movie.id!);
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: `/booking/${movie.id}/${this.showTimes}`,
          date: this.selectedDate?.toISOString()
        }
      });
      return;
    }

    if (!this.selectedDate || !this.showTimes || this.totalTickets === 0 ||
      this.selectedSeats.length !== this.totalTickets) {
      this.checkoutError = 'Select a date, showtime, ticket quantity, and matching number of seats.';
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
    if (!this.selectedDate) { this.paymentError = 'Please select a show date.'; return; }
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

    const payload = {
      userId,
      movieId: movie.id,
      showDate: this.toLocalDateString(this.selectedDate),
      showTime: this.showTimes,
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
        // Close payment dialog first, then open success dialog as an independent sibling
        this.paymentDialog = false;
        setTimeout(() => {
          this.paymentSuccessDialog = true;
        });
        sessionStorage.removeItem(this.draftStorageKey);
        this.resetBookingForm();
        this.loadStoredCards();
      },
      error: err => {
        this.paymentProcessing = false;
        const raw: string = typeof err?.error === 'string'
          ? err.error
          : err?.error?.message || '';
        this.paymentError = raw.startsWith('PAYMENT_DECLINED:')
          ? raw.replace('PAYMENT_DECLINED:', '').trim()
          : (raw || 'Payment could not be completed. Please try again.');
      }
    });
  }

  // Called by both the Done button and the X icon on the success dialog
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
  }

  maskCard(cardNumber: string): string {
    const digits = cardNumber.replace(/\s+/g, '');
    return `**** **** **** ${digits.slice(-4)}`;
  }

  formatPaymentCardNumberInput(): void {
    this.paymentCardNumber = this.groupCardNumber(this.paymentCardNumber);
  }

  formatPaymentZipInput(): void {
    this.paymentZip = this.onlyDigits(this.paymentZip).slice(0, 5);
  }

  formatPaymentCvvInput(): void {
    this.paymentCvv = this.onlyDigits(this.paymentCvv).slice(0, 4);
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
      error: () => {
        this.storedCards = [];
        this.selectedCardId = null;
        this.useSavedCard = false;
      }
    });
  }

  private persistBookingDraft(movieId: number): void {
    const draft = {
      movieId,
      showTimes: this.showTimes,
      selectedDate: this.selectedDate ? this.toLocalDateString(this.selectedDate) : '',
      adult: this.adult, child: this.child, senior: this.senior,
      selectedSeats: this.selectedSeats,
      checkoutEmail: this.checkoutEmail
    };
    sessionStorage.setItem(this.draftStorageKey, JSON.stringify(draft));
  }

  private restoreBookingDraft(): void {
    const raw = sessionStorage.getItem(this.draftStorageKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      const routeMovieId = Number(this.route.snapshot.paramMap.get('id'));
      if (draft.movieId !== routeMovieId) return;
      this.showTimes = draft.showTimes || this.showTimes;
      this.selectedDate = draft.selectedDate ? new Date(`${draft.selectedDate}T00:00:00`) : this.selectedDate;
      this.adult = draft.adult ?? this.adult;
      this.child = draft.child ?? this.child;
      this.senior = draft.senior ?? this.senior;
      this.selectedSeats = Array.isArray(draft.selectedSeats) ? draft.selectedSeats : this.selectedSeats;
      this.checkoutEmail = draft.checkoutEmail || this.checkoutEmail;
    } catch {
      sessionStorage.removeItem(this.draftStorageKey);
    }
  }

  private resetBookingForm(): void {
    this.adult = 0; this.child = 0; this.senior = 0;
    this.selectedSeats = [];
    this.paymentCvv = '';
    if (!this.useSavedCard) {
      this.paymentName = '';
      this.paymentCardNumber = '';
      this.paymentExpiryDate = null;
      this.paymentZip = '';
    }
  }

  private toLocalDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private formatExpiryMonth(date: Date | null): string {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private onlyDigits(value: string): string {
    return String(value || '').replace(/\D/g, '');
  }

  private groupCardNumber(value: string): string {
    return this.onlyDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }
}