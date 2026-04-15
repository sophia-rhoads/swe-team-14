import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Movie } from '../models/movie';

export interface Address {
  homeAddress: string;
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
  address: Address;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = 'http://localhost:8080/api/profile';
  private favUrl = 'http://localhost:8080/api/favorites';
  private favoritesChangedSubject = new Subject<void>();
  favoritesChanged$ = this.favoritesChangedSubject.asObservable();

  constructor(private http: HttpClient) { }

  getProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${userId}`);
  }

  updateProfile(userId: number, payload: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/${userId}`, payload);
  }

  // Cards
  getCards(userId: number) {
    return this.http.get<any[]>(`/api/auth/cards/${userId}`);
  }

  addCard(userId: number, card: any) {
    return this.http.post(`/api/auth/cards/${userId}`, card);
  }

  deleteCard(cardId: number) {
    return this.http.delete(`/api/auth/cards/${cardId}`);
  }

  // Favorites
  getFavorites(userId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.favUrl}/${userId}`);
  }

  toggleFavorite(userId: number, movieId: number): Observable<{ favorite: Boolean }> {
    return this.http.post<{ favorite: Boolean }>(
      `${this.favUrl}/toggle?userId=${userId}&movieId=${movieId}`,
      {}
    );
  }

  removeFavorite(userId: number, movieId: number) {
    return this.http.delete(`${this.favUrl}/${userId}/${movieId}`);
  }

  notifyFavoritesChanged() {
    this.favoritesChangedSubject.next();
  }
}