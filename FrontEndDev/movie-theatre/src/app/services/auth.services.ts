import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, user, { responseType: 'text' });
  }

  login(user: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, user);
  }

  setSession(user: LoginResponse) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', user.id.toString());
  }

  getCurrentUser(): LoginResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  logout() {
    localStorage.clear();
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email }, { responseType: 'text' });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword, confirmPassword }, { responseType: 'text' });
  }
}