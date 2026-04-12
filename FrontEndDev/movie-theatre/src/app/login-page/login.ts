import { Component } from '@angular/core';
import { AuthService, LoginResponse } from '../services/auth.services';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';

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
  loading = false;
  reseting = false;

  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    this.error = '';
    this.successMessage = '';

    if (!this.email || !this.email.includes('@')) {
      this.error = 'Please enter a valid email first';
      return;
    }

    this.reseting = true;

    this.auth.forgotPassword(this.email.trim())
      .pipe(finalize(() => this.reseting = false))
      .subscribe({
        next: () => {
          this.successMessage =
            'If an account with that email exists, a reset link has been sent';
          this.cdr.detectChanges();
          this.error = '';
        },
        error: () => {
          this.error = 'Something went wrong. Please try again.';
        }
      },);
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  login() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;

    this.auth.login({
      email: this.email.trim(),
      password: this.password
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res: LoginResponse) => {

        this.auth.setSession(res);

        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        const date = this.route.snapshot.queryParams['date'];

        // Role based routing
        if (res.role === 'ADMIN') {
          this.router.navigateByUrl('/admin-page');
        } else if (returnUrl) {
          this.router.navigate([returnUrl], { queryParams: { date } });
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        console.error('Login failed', err);

        if (err.status === 401) {
          this.error = 'Invalid email or password';
        } else if (err.status === 403) {
          this.error = err.error || 'Please activate your account first';
        } else if (err.status === 0) {
          this.error = 'Server not reachable';
        } else {
          this.error = 'Something went wrong. Please try again';
        }
      }
    });
  }
}