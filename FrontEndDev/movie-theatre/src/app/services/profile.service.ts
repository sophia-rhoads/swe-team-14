import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  homeAddress: string;
  county: string;
  state: string;
  zipCode: string;
}

export interface UpdateProfileRequest {
  username: string;
  phoneNumber: string;
  password?: string;
  homeAddress: string;
  county: string;
  state: string;
  zipCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8081/api/profile';

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${userId}`);
  }

  updateProfile(userId: number, payload: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/${userId}`, payload);
  }
}