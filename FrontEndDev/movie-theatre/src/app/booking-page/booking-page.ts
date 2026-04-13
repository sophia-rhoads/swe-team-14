import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.services';
import { Movie } from '../models/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.services';
import { BookingRecord, BookingService } from '../services/booking.services';
import { ProfileService, PaymentCard } from '../services/profile.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    InputNumberModule,
    DatePickerModule,
    DialogModule,
    InputTextModule
  ],
  templateUrl: './booking-page.html',
  styleUrls: ['./booking-page.scss']
})
export class BookingPage {
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
  readonly taxRate = 0.05;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService,
    private profileService: ProfileService,
    private movieService: MovieService
  ) {
    // Fetch movie
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.movieService.getMovieById(id);
      })
    );
  }
  ngOnInit() {
    // Get showtime from route params
    this.route.paramMap.subscribe(params => {
      const passedShowtime = params.get('showtime');
      if (passedShowtime) {
        this.showTimes = passedShowtime;
      }
    });
    // Get date from query params (PRIMARY SOURCE)
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        console.log('RAW DATE FROM URL:', params['date']);
        this.selectedDate = new Date(params['date']);
        // Remove timezone offset issues
        this.selectedDate.setHours(0, 0, 0, 0);
        console.log('PARSED DATE:', this.selectedDate);
      }
    });
    const stateDate = history.state?.date;
    if (!this.selectedDate && stateDate) {
      this.selectedDate = new Date(stateDate);
      this.selectedDate.setHours(0, 0, 0, 0);

      this.restoreBookingDraft();
      this.checkoutEmail = this.authService.getCurrentUser()?.email || '';
      this.loadStoredCards();
    }
  }
  // Ticket count
  get totalTickets(): number {
    return (this.adult || 0) + (this.child || 0) + (this.senior || 0);
  }
  get subtotal(): number {
    return (this.adult || 0) * 5 + (this.child || 0) * 2.5 + (this.senior || 0) * 3.5;
  }
  get ticketSummary(): string {
    const ticketTypes = [
      { label: 'Adult', count: this.adult || 0, price: 5 },
      { label: 'Child', count: this.child || 0, price: 2.5 },
      { label: 'Senior', count: this.senior || 0, price: 3.5 }
    ];

    return ticketTypes
      .filter(ticket => ticket.count > 0)
      .map(ticket => `${ticket.count} ${ticket.label} @ $${ticket.price.toFixed(2)}`)
      .join(', ');
  }
  get selectedSeatsLabel(): string {
    return this.selectedSeats.length ? this.selectedSeats.join(', ') : 'None';
  }
  // Seat selection
  selectSeat(seat: string) {
    if (!this.selectedSeats.includes(seat)) {
      if (this.selectedSeats.length >= this.totalTickets) return;
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
    }
  }
  isSelected(seat: string): boolean {
    return this.selectedSeats.includes(seat);
  }
  isDisabled(seat: string): boolean {
    return !this.selectedSeats.includes(seat) &&
      this.selectedSeats.length >= this.totalTickets;
  }
  // Checkout
  proceedToCheckout(movie: Movie) {
    this.checkoutError = '';

    if (movie.status === 'COMING_SOON') {
      this.checkoutError = 'Ticket booking is not available because this movie is coming soon.';
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.persistBookingDraft(movie.id);
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: `/booking/${movie.id}/${this.showTimes}`,
          date: this.selectedDate?.toISOString()
        }
      });
      return;
    }
    if (
      !this.selectedDate ||
      !this.showTimes ||
      this.totalTickets === 0 ||
      this.selectedSeats.length !== this.totalTickets
    ) {
      this.checkoutError = 'Select a date, showtime, ticket quantity, and matching number of seats.';
      return;
    }

    this.checkoutEmail = this.checkoutEmail || this.authService.getCurrentUser()?.email || '';
    this.displayDialog = true;
  }

  continueToPayment() {
    this.checkoutError = '';
    this.paymentError = '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.checkoutEmail.trim())) {
      this.checkoutError = 'Enter a valid email address for the order confirmation.';
      return;
    }

    this.displayDialog = false;
    this.paymentProcessing = false;
    this.paymentDialog = true;
  }

  submitPayment(movie: Movie) {
    this.paymentError = '';

    const userId = this.authService.getUserId();
    if (!userId) {
      this.paymentError = 'Please log in again before completing payment.';
      return;
    }

    if (!/^\d{3,4}$/.test(this.onlyDigits(this.paymentCvv))) {
      this.paymentError = 'Enter a valid CVV.';
      return;
    }

    if (!this.selectedDate) {
      this.paymentError = 'Please select a show date.';
      return;
    }

    const usingStoredCard = this.useSavedCard && this.storedCards.length > 0;
    const sanitizedCardNumber = this.onlyDigits(this.paymentCardNumber);
    const sanitizedZip = this.onlyDigits(this.paymentZip).slice(0, 5);
    const formattedExpiry = this.formatExpiryMonth(this.paymentExpiryDate);

    if (usingStoredCard && !this.selectedCardId) {
      this.paymentError = 'Choose one of your saved cards.';
      return;
    }

    if (!usingStoredCard) {
      if (!this.paymentName.trim()) {
        this.paymentError = 'Enter the cardholder name.';
        return;
      }

      if (!/^\d{5}$/.test(sanitizedZip)) {
        this.paymentError = 'Enter a valid 16-digit card number.';
        return;
      }

      if (!formattedExpiry) {
        this.paymentError = 'Choose a valid expiry month.';
        return;
      }

      if (!/^\d{5}$/.test(this.paymentZip.trim())) {
        this.paymentError = 'Enter a valid 5-digit billing ZIP code.';
        return;
      }
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
        cardholderName: this.paymentName.trim(),
        cardNumber: sanitizedCardNumber,
        expiryDate: formattedExpiry,
        cvv: this.onlyDigits(this.paymentCvv).slice(0, 4),
        billingZipCode: sanitizedZip
      }
    };

    this.paymentProcessing = true;

    this.bookingService.checkout(payload)
      .subscribe({
        next: booking => {
          this.paymentProcessing = false;
          this.completedBooking = booking;
          this.paymentDialog = false;
          this.paymentSuccessDialog = true;
          sessionStorage.removeItem(this.draftStorageKey);
          this.resetBookingForm();
          this.loadStoredCards();
        },
        error: error => {
          this.paymentProcessing = false;
          console.error('Payment failed', error);
          this.paymentError = error?.error || 'Payment could not be completed.';
        }
      });
  }

  closePaymentDialog() {
    this.paymentDialog = false;
    this.paymentError = '';
    this.paymentProcessing = false;
  }

  closeSuccessDialog() {
    this.paymentSuccessDialog = false;
    this.completedBooking = null;
  }

  selectSavedCard(cardId: number) {
    this.selectedCardId = cardId;
    this.useSavedCard = true;
    this.paymentError = '';
  }

  switchPaymentMode(useSavedCard: boolean) {
    this.useSavedCard = useSavedCard;
    this.paymentError = '';
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

  maskCard(cardNumber: string): string {
    const digits = cardNumber.replace(/\s+/g, '');
    return `**** **** **** ${digits.slice(-4)}`;
  }

  private loadStoredCards() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.storedCards = [];
      return;
    }

    this.profileService.getCards(userId).subscribe({
      next: cards => {
        this.storedCards = cards;
        if (cards.length > 0) {
          this.selectedCardId = this.selectedCardId && cards.some(card => card.id === this.selectedCardId)
            ? this.selectedCardId
            : cards[0].id;
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

  private persistBookingDraft(movieId: number) {
    const draft = {
      movieId,
      showTimes: this.showTimes,
      selectedDate: this.selectedDate ? this.toLocalDateString(this.selectedDate) : '',
      adult: this.adult,
      child: this.child,
      senior: this.senior,
      selectedSeats: this.selectedSeats,
      checkoutEmail: this.checkoutEmail
    };
    sessionStorage.setItem(this.draftStorageKey, JSON.stringify(draft));
  }

  private restoreBookingDraft() {
    const raw = sessionStorage.getItem(this.draftStorageKey);
    if (!raw) {
      return;
    }

    try {
      const draft = JSON.parse(raw);
      const routeMovieId = Number(this.route.snapshot.paramMap.get('id'));
      if (draft.movieId !== routeMovieId) {
        return;
      }

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

  private resetBookingForm() {
    this.adult = 0;
    this.child = 0;
    this.senior = 0;
    this.selectedSeats = [];
    this.paymentCvv = '';
    if (!this.useSavedCard) {
      this.paymentName = '';
      this.paymentCardNumber = '';
      this.paymentExpiryDate = null;
      this.paymentZip = '';
    }
  }

  formatPaymentCardNumberInput() {
    this.paymentCardNumber = this.groupCardNumber(this.paymentCardNumber);
  }

  formatPaymentZipInput() {
    this.paymentZip = this.onlyDigits(this.paymentZip).slice(0, 5);
  }

  formatPaymentCvvInput() {
    this.paymentCvv = this.onlyDigits(this.paymentCvv).slice(0, 4);
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatExpiryMonth(date: Date | null): string {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    return `${year}-${month}`;
  }

  private onlyDigits(value: string): string {
    return String(value || '').replace(/\D/g, '');
  }

  private groupCardNumber(value: string): string {
    const digits = this.onlyDigits(value).slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }
}