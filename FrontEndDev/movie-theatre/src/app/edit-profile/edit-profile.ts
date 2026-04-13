import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

import { ProfileService, UpdateProfileRequest, PaymentCard } from '../services/profile.service';
import { AuthService } from '../services/auth.services';
import { Movie } from '../models/movie';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookingRecord, BookingService } from '../services/booking.services';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    InputTextModule,
    ButtonModule,
    RatingModule,
    TableModule,
    DialogModule,
    DatePickerModule,
    SelectModule
  ],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss']
})
export class EditProfile implements OnInit, OnDestroy {

  userId!: number;

  // User Info
  userName = '';
  firstName = '';
  lastName = '';
  email = '';
  phoneNum = '';
  dateOfBirth: Date | null = null;
  countryCode = '+1';
  phoneNumberOnly = '';

  password = '';

  // ADDRESS
  usrAddress = '';
  usrCity = '';
  usrState = '';
  usrZipCode = '';

  // UI
  loading = false;
  saveMessage = '';
  errorMessage = '';

  // FAVORITES
  favoriteMovies: Movie[] = [];
  bookingHistory: BookingRecord[] = [];
  savedCards: PaymentCard[] = [];
  selectedBooking: BookingRecord | null = null;
  bookingDetailsVisible = false;
  newCardNumber = '';
  newCardExpiry: Date | null = null;
  newCardZip = '';
  newCardHolderName = '';
  newCardType = '';
  paymentMessage = '';
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
    private bookingService: BookingService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!;
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

  loadProfile() {
    this.loading = true;

    this.profileService.getProfile(this.userId).subscribe({
      next: (profile) => {
        this.userName = profile.username;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.email = profile.email;
        this.phoneNum = profile.phone;
        this.dateOfBirth = profile.dateOfBirth ? new Date(`${profile.dateOfBirth}T00:00:00`) : null;
        this.hydratePhoneFields(profile.phone);

        this.usrAddress = profile.address?.homeAddress || '';
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
  loadFavorites() {
    this.profileService.getFavorites(this.userId).subscribe(res => {

      const uniqueMap = new Map<number, Movie>();

      res.forEach(movie => {
        uniqueMap.set(movie.id, movie);
      });

      this.favoriteMovies = Array.from(uniqueMap.values());
    });
  }

  loadBookingHistory() {
    this.bookingService.getBookingHistory(this.userId).subscribe({
      next: bookings => {
        this.bookingHistory = bookings;
      },
      error: () => {
        this.bookingHistory = [];
      }
    });
  }

  loadCards() {
    this.profileService.getCards(this.userId).subscribe({
      next: cards => {
        this.savedCards = cards;
      },
      error: () => {
        this.savedCards = [];
      }
    });
  }

  updateProfile() {

    const payload: UpdateProfileRequest = {
      username: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      dateOfBirth: this.dateOfBirth ? this.toLocalDateString(this.dateOfBirth) : '',
      phone: `${this.countryCode}${this.phoneNumberOnly}`,
      password: this.password?.trim() ? this.password : undefined,

      address: {
        homeAddress: this.usrAddress,
        city: this.usrCity,
        state: this.usrState,
        zipCode: this.usrZipCode
      }
    };

    this.profileService.updateProfile(this.userId, payload).subscribe({
      next: () => {
        this.saveMessage = 'Profile updated successfully';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Update failed';
        this.saveMessage = '';
      }
    });
  }
  removeFavorite(movieId: number) {
    const userId = this.userId;

    this.profileService.removeFavorite(userId, movieId)
      .subscribe(() => {
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== movieId);
        this.profileService.notifyFavoritesChanged();
      });
  }

  viewDetails(movie: Movie) {
    this.router.navigate(['/movie', movie.id], {
      state: { movieTitle: movie.title }
    });
  }
  openBookingDetails(booking: BookingRecord) {
    this.selectedBooking = booking;
    this.bookingDetailsVisible = true;
  }

  closeBookingDetails() {
    this.bookingDetailsVisible = false;
    this.selectedBooking = null;
  }

  addPaymentCard() {
    const sanitizedCardNumber = this.onlyDigits(this.newCardNumber);
    const sanitizedZip = this.onlyDigits(this.newCardZip).slice(0, 5);
    const formattedExpiry = this.formatExpiryMonth(this.newCardExpiry);

    if (!this.newCardHolderName.trim()) {
      this.paymentMessage = 'Enter the card holder name.';
      return;
    }

    if (!/^\d{16}$/.test(sanitizedCardNumber)) {
      this.paymentMessage = 'Enter a valid 16-digit card number.';
      return;
    }

    if (!formattedExpiry) {
      this.paymentMessage = 'Choose a valid expiry month.';
      return;
    }

    if (!/^\d{5}$/.test(sanitizedZip)) {
      this.paymentMessage = 'Enter a valid 5-digit ZIP code.';
      return;
    }

    this.profileService.addCard(this.userId, {
      cardholderName: this.newCardHolderName.trim(),
      cardType: this.newCardType || this.detectCardBrand(sanitizedCardNumber),
      cardNumber: sanitizedCardNumber,
      expirationDate: formattedExpiry,
      billingZipCode: sanitizedZip
    }).subscribe({
      next: () => {
        this.paymentMessage = 'Card saved successfully.';
        this.newCardHolderName = '';
        this.newCardNumber = '';
        this.newCardExpiry = null;
        this.newCardZip = '';
        this.newCardType = '';
        this.loadCards();
      },
      error: error => {
        this.paymentMessage =
          typeof error?.error === 'string'
            ? error.error
            : error?.error?.message || 'Unable to save card.';
      }
    });
  }

  deleteCard(cardId: number) {
    this.profileService.deleteCard(cardId).subscribe({
      next: () => {
        this.paymentMessage = 'Card removed.';
        this.loadCards();
      },
      error: () => {
        this.paymentMessage = 'Unable to remove card.';
      }
    });
  }

  maskCard(cardNumber: string): string {
    const digits = this.onlyDigits(cardNumber);
    return `**** **** **** ${digits.slice(-4)}`;
  }

  formatCardNumberInput() {
    this.newCardNumber = this.groupCardNumber(this.newCardNumber);
  }

  formatZipInput() {
    this.newCardZip = this.onlyDigits(this.newCardZip).slice(0, 5);
  }

  private detectCardBrand(cardNumber: string): string {
    const digits = this.onlyDigits(cardNumber);
    if (digits.startsWith('4')) {
      return 'Visa';
    }
    if (/^5[1-5]/.test(digits)) {
      return 'Mastercard';
    }
    if (/^3[47]/.test(digits)) {
      return 'American Express';
    }
    return 'Card';
  }

  private hydratePhoneFields(phone: string) {
    const matchingCode = this.countryCodes
      .map(option => option.value)
      .find(code => phone?.startsWith(code));

    if (matchingCode) {
      this.countryCode = matchingCode;
      this.phoneNumberOnly = phone.slice(matchingCode.length);
    } else {
      this.countryCode = '+1';
      this.phoneNumberOnly = phone || '';
    }
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
