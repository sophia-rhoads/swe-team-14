import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ProfileService, UpdateProfileRequest, PaymentCard, AddCardRequest } from '../services/profile.service';
import { AuthService } from '../services/auth.services';
import { BookingRecord, BookingService } from '../services/booking.services';
import { Movie } from '../models/movie';
import { RecommendationService } from '../services/recommendation.services';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TabsModule, InputTextModule,
    ButtonModule, RatingModule, TableModule, DialogModule,
    DatePickerModule, SelectModule, ProgressSpinnerModule
  ],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss']
})
export class EditProfile implements OnInit, OnDestroy {

  userId!: number;

  // Profile fields
  userName = '';
  firstName = '';
  lastName = '';
  email = '';
  dateOfBirth: Date | null = null;
  countryCode = '+1';
  phoneNumberOnly = '';
  password = '';
  preferences = '';
  promotionsOptIn = false;

  // Address fields
  usrAddress = '';
  usrCity = '';
  usrState = '';
  usrZipCode = '';

  // UI state
  loading = false;
  saveMessage = '';
  errorMessage = '';

  // activeTab Set from the ?tab=query param so that navigating to /edit-profile?tab=orders
  activeTab: string = 'profile';

  // Data
  favoriteMovies: Movie[] = [];
  bookingHistory: BookingRecord[] = [];
  savedCards: PaymentCard[] = [];
  selectedBooking: BookingRecord | null = null;
  bookingDetailsVisible = false;

  // AI Recommendations
  recommendedMovies: Movie[] = [];
  recommendationsLoading = false;
  recommendationsError = '';
  recommendationsLoaded = false;

  // New card form fields
  newCardHolderName = '';
  newCardNumber = '';
  newCardType = '';
  newCardExpiry: Date | null = null;
  newCardZip = '';
  newCardCvv = '';
  paymentMessage = '';
  paymentMessageType: 'success' | 'error' = 'success';

  countryCodes = [
    { label: '+1 (USA)', value: '+1' },
    { label: '+91 (India)', value: '+91' },
    { label: '+44 (UK)', value: '+44' }
  ];

  cardTypes = [
    { label: 'Visa', value: 'Visa' },
    { label: 'Mastercard', value: 'Mastercard' },
    { label: 'American Express', value: 'American Express' },
    { label: 'Discover', value: 'Discover' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private recommendationService: RecommendationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!;

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const valid = ['profile', 'favorites', 'orders', 'payments', 'recommendations'];
        this.activeTab = valid.includes(params['tab']) ? params['tab'] : 'profile';
        if (this.activeTab === 'recommendations') {
          this.loadRecommendations();
        }
        this.cdr.detectChanges();
      });

    this.loadProfile();
    this.loadFavorites();
    this.loadCards();
    this.loadBookingHistory();

    this.profileService.favoritesChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadFavorites());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile(this.userId).subscribe({
      next: (profile) => {
        this.userName = profile.username;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.email = profile.email;
        this.dateOfBirth = profile.dateOfBirth ? new Date(`${profile.dateOfBirth}T00:00:00`) : null;
        this.hydratePhoneFields(profile.phone);
        this.preferences = profile.preferences || '';
        this.promotionsOptIn = !!profile.promotionsOptIn;
        this.usrAddress = profile.address?.street || '';
        this.usrCity = profile.address?.city || '';
        this.usrState = profile.address?.state || '';
        this.usrZipCode = profile.address?.zipCode || '';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  loadFavorites(): void {
    this.profileService.getFavorites(this.userId).subscribe(res => {
      const uniqueMap = new Map<number, Movie>();
      res.forEach(movie => uniqueMap.set(movie.id, movie));
      this.favoriteMovies = Array.from(uniqueMap.values());
    });
  }

  loadBookingHistory(): void {
    this.bookingService.getBookingHistory(this.userId).subscribe({
      next: bookings => { this.bookingHistory = bookings; },
      error: () => { this.bookingHistory = []; }
    });
  }

  loadCards(): void {
    this.profileService.getCards(this.userId).subscribe({
      next: cards => { this.savedCards = cards; },
      error: () => { this.savedCards = []; }
    });
  }

  updateProfile(): void {
    const payload: UpdateProfileRequest = {
      username: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      dateOfBirth: this.dateOfBirth ? this.toLocalDateString(this.dateOfBirth) : '',
      phone: `${this.countryCode}${this.phoneNumberOnly}`,
      password: this.password?.trim() ? this.password : undefined,
      preferences: this.preferences,
      promotionsOptIn: this.promotionsOptIn,
      address: {
        street: this.usrAddress,
        city: this.usrCity,
        state: this.usrState,
        zipCode: this.usrZipCode
      }
    };

    this.profileService.updateProfile(this.userId, payload).subscribe({
      next: () => { this.saveMessage = 'Profile updated successfully'; this.errorMessage = ''; },
      error: () => { this.errorMessage = 'Update failed'; this.saveMessage = ''; }
    });
  }

  removeFavorite(movieId: number): void {
    this.profileService.removeFavorite(this.userId, movieId).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(m => m.id !== movieId);
      this.profileService.notifyFavoritesChanged();
    });
  }

  viewDetails(movie: Movie): void {
    this.router.navigate(['/movie', movie.id], { state: { movieTitle: movie.title } });
  }

  openBookingDetails(booking: BookingRecord): void {
    this.selectedBooking = booking;
    this.bookingDetailsVisible = true;
  }

  closeBookingDetails(): void {
    this.bookingDetailsVisible = false;
    this.selectedBooking = null;
  }

  addPaymentCard(): void {
    this.paymentMessage = '';
    const sanitizedCardNumber = this.onlyDigits(this.newCardNumber);
    const sanitizedZip = this.onlyDigits(this.newCardZip).slice(0, 5);
    const sanitizedCvv = this.onlyDigits(this.newCardCvv);
    const formattedExpiry = this.formatExpiryMonth(this.newCardExpiry);

    if (!this.newCardHolderName.trim()) { this.setPaymentMessage('Enter the card holder name.', 'error'); return; }
    if (!/^\d{16}$/.test(sanitizedCardNumber)) { this.setPaymentMessage('Enter a valid 16-digit card number.', 'error'); return; }
    if (!this.newCardType) { this.setPaymentMessage('Select a card type.', 'error'); return; }
    if (!formattedExpiry) { this.setPaymentMessage('Choose a valid expiry month.', 'error'); return; }
    if (!/^\d{5}$/.test(sanitizedZip)) { this.setPaymentMessage('Enter a valid 5-digit ZIP code.', 'error'); return; }
    if (!/^\d{3,4}$/.test(sanitizedCvv)) { this.setPaymentMessage('Enter a valid CVV (3 or 4 digits).', 'error'); return; }

    const payload: AddCardRequest = {
      cardHolderName: this.newCardHolderName.trim(),
      cardType: this.newCardType,
      cardNumber: sanitizedCardNumber,
      expirationDate: formattedExpiry,
      billingZipCode: sanitizedZip
    };

    this.profileService.addCard(this.userId, payload).subscribe({
      next: () => {
        this.newCardHolderName = ''; this.newCardNumber = ''; this.newCardExpiry = null;
        this.newCardZip = ''; this.newCardType = ''; this.newCardCvv = '';
        this.loadCards();
        setTimeout(() => { this.setPaymentMessage('Card saved successfully.', 'success'); this.cdr.detectChanges(); });
      },
      error: err => {
        const msg = typeof err?.error === 'string' ? err.error : err?.error?.message || 'Unable to save card.';
        setTimeout(() => { this.setPaymentMessage(msg, 'error'); this.cdr.detectChanges(); });
      }
    });
  }

  deleteCard(cardId: number): void {
    this.profileService.deleteCard(cardId).subscribe({
      next: () => {
        this.loadCards();
        setTimeout(() => { this.setPaymentMessage('Card removed successfully.', 'success'); this.cdr.detectChanges(); });
      },
      error: () => {
        setTimeout(() => { this.setPaymentMessage('Unable to remove card.', 'error'); this.cdr.detectChanges(); });
      }
    });
  }

  maskCard(cardNumber: string): string {
    return `**** **** **** ${this.onlyDigits(cardNumber).slice(-4)}`;
  }

  formatCardNumberInput(): void { this.newCardNumber = this.groupCardNumber(this.newCardNumber); }
  formatZipInput(): void { this.newCardZip = this.onlyDigits(this.newCardZip).slice(0, 5); }
  formatCvvInput(): void { this.newCardCvv = this.onlyDigits(this.newCardCvv).slice(0, 4); }

  private setPaymentMessage(msg: string, type: 'success' | 'error'): void {
    this.paymentMessage = msg; this.paymentMessageType = type;
  }

  loadRecommendations(): void {
    if (this.recommendationsLoaded) return;
    this.recommendationsLoading = true;
    this.recommendationsError = '';
    this.recommendationService.getRecommendations(this.userId).subscribe({
      next: movies => {
        this.recommendedMovies = movies;
        this.recommendationsLoading = false;
        this.recommendationsLoaded = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.recommendationsError = 'Unable to load recommendations right now. Please try again later.';
        this.recommendationsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  refreshRecommendations(): void {
    this.recommendationsLoaded = false;
    this.loadRecommendations();
  }

  addRecommendedToFavorites(movie: Movie): void {
    this.profileService.toggleFavorite(this.userId, movie.id).subscribe({
      next: () => {
        this.loadFavorites();
        this.profileService.notifyFavoritesChanged();
        this.cdr.detectChanges();
      },
      error: () => { }
    });
  }

  isAlreadyFavorite(movieId: number): boolean {
    return this.favoriteMovies.some(m => m.id === movieId);
  }

  private hydratePhoneFields(phone: string): void {
    const match = this.countryCodes.map(o => o.value).find(c => phone?.startsWith(c));
    this.countryCode = match || '+1';
    this.phoneNumberOnly = match ? phone.slice(match.length) : (phone || '');
  }

  private toLocalDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private formatExpiryMonth(date: Date | null): string {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private onlyDigits(value: string): string { return String(value || '').replace(/\D/g, ''); }

  private groupCardNumber(value: string): string {
    return this.onlyDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }
}
