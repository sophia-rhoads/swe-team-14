import { Component } from '@angular/core';
import { AuthService, LoginResponse } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
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
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        const date = this.route.snapshot.queryParams['date'];

        if (returnUrl) {
          this.router.navigate([returnUrl], { queryParams: { date } });
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.error = 'Invalid credentials';
      }
    });
  }
}