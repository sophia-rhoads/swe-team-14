import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { AuthService, LoginResponse } from '../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, InputTextModule, ButtonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage {

  email = '';
  password = '';
  error = '';
  successMessage = '';
  loginLoading = false;
  forgotPasswordLoading = false;
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.email || !this.email.includes('@')) {
      this.error = 'Please enter a valid email first';
      return;
    }

    this.forgotPasswordLoading = true;

    this.auth.forgotPassword(this.email.trim())
      .pipe(finalize(() => this.forgotPasswordLoading = false))
      .subscribe({
        next: () => {
          this.successMessage = 'If an account with that email exists, a reset link has been sent';
          this.error = '';
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Something went wrong. Please try again.';
        }
      });
  }

  login(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loginLoading = true;

    this.auth.login({ email: this.email.trim(), password: this.password })
      .pipe(finalize(() => this.loginLoading = false))
      .subscribe({
        next: (res: LoginResponse) => {
          this.auth.setSession(res);

          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          const date = this.route.snapshot.queryParams['date'];

          if (res.role === 'ADMIN') {
            this.router.navigateByUrl('/admin-page');
          } else if (returnUrl) {
            this.router.navigate([returnUrl], { queryParams: { date } });
          } else {
            this.router.navigateByUrl('/');
          }
        },
        error: (err) => {
          if (err.status === 401) {
            this.error = 'Invalid email or password';
          } else if (err.status === 403) {
            this.error = err.error || 'Please activate your account first';
          } else if (err.status === 0) {
            this.error = 'Server not reachable. Please try again later';
          } else {
            this.error = 'Something went wrong. Please try again';
          }
        }
      });
  }
}