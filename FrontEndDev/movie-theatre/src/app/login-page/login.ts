import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

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

  constructor(private auth: AuthService, private router: Router) { }

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
    }).subscribe({
      next: (res) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/']).then(() => {
          window.dispatchEvent(new Event('storage'));
        });;
      },
      error: () => {
        this.error = 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}