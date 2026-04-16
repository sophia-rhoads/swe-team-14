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

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8081/api/auth';
  private apiUrl = 'http://localhost:8081/api/profile';

  constructor(private http: HttpClient) { }

  // Register User
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user, {
      responseType: 'text'
    });
  }

  // Login Store Session
  login(user: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, user);
  }

  // Session Management
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

  // Role Management
  getRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  // logout action
  logout() {
    localStorage.clear();
  }

  // Forgot Password
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email }, {
      responseType: 'text'
    });
  }

  // Reset Password
  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, {
      token,
      newPassword,
      confirmPassword
    }, {
      responseType: 'text'
    });
  }

  updateProfile(data: any, userId: number) {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, data);
  }
}