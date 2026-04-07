import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient) { }
  getProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${userId}`);
  }
  updateProfile(userId: number, payload: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/${userId}`, payload);
  }
  // CARDS
  getCards(userId: number) {
    return this.http.get<any[]>(`/api/auth/cards/${userId}`);
  }

  addCard(userId: number, card: any) {
    return this.http.post(`/api/auth/cards/${userId}`, card);
  }

  deleteCard(cardId: number) {
    return this.http.delete(`/api/auth/cards/${cardId}`);
  }

  // FAVORITES
  getFavorites(userId: number) {
    return this.http.get<any[]>(`/api/auth/favorites/${userId}`);
  }

  addFavorite(userId: number, movieName: string) {
    return this.http.post(`/api/auth/favorites/${userId}`, { movieName });
  }

  deleteFavorite(id: number) {
    return this.http.delete(`/api/auth/favorites/${id}`);
  }
}