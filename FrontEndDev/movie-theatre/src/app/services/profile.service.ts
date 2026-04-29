import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Movie } from '../models/movie';

// Matches MailingAddr.java JSON: { street, city, state, zipCode }
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  preferences: string;
  promotionsOptIn: boolean;
  address: Address;
}

export interface UpdateProfileRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  password?: string;
  preferences: string;
  promotionsOptIn: boolean;
  address: Address;
}

// Matches PaymentCard.java JSON output (cardHolderName capital H)
export interface PaymentCard {
  id: number;
  cardHolderName: string;
  cardNumber: string;
  cardType: string;
  expirationDate: string;
  billingZipCode: string;
}

export interface AddCardRequest {
  cardHolderName: string;
  cardType: string;
  cardNumber: string;
  expirationDate: string;
  billingZipCode: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private readonly profileUrl = 'http://localhost:8080/api/profile';
  private readonly cardsUrl = 'http://localhost:8080/api/cards';
  private readonly favUrl = 'http://localhost:8080/api/favorites';

  private favoritesChangedSubject = new Subject<void>();
  favoritesChanged$ = this.favoritesChangedSubject.asObservable();

  constructor(private http: HttpClient) { }

  getProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.profileUrl}/${userId}`);
  }

  updateProfile(userId: number, payload: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.profileUrl}/${userId}`, payload);
  }

  getCards(userId: number): Observable<PaymentCard[]> {
    return this.http.get<PaymentCard[]>(`${this.cardsUrl}/${userId}`);
  }

  addCard(userId: number, card: AddCardRequest): Observable<PaymentCard> {
    return this.http.post<PaymentCard>(`${this.cardsUrl}/${userId}`, card);
  }

  deleteCard(cardId: number): Observable<string> {
    return this.http.delete(`${this.cardsUrl}/${cardId}`, { responseType: 'text' });
  }

  getFavorites(userId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.favUrl}/${userId}`);
  }

  toggleFavorite(userId: number, movieId: number): Observable<{ favorite: boolean }> {
    return this.http.post<{ favorite: boolean }>(
      `${this.favUrl}/toggle?userId=${userId}&movieId=${movieId}`, {}
    );
  }

  removeFavorite(userId: number, movieId: number): Observable<void> {
    return this.http.delete<void>(`${this.favUrl}/${userId}/${movieId}`);
  }

  notifyFavoritesChanged(): void {
    this.favoritesChangedSubject.next();
  }
}
