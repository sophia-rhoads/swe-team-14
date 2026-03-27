import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule, InputTextModule, ButtonModule, RouterLink],
    templateUrl: './registration.html',
    styleUrls: ['./registration.scss']
})
export class RegisterPage {

    name = '';
    email = '';
    password = '';
    error = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    register() {
        this.error = '';

        if (!this.name || !this.email || !this.password) {
            this.error = 'All fields are required';
            return;
        }

        this.loading = true;

        this.auth.register({
            name: this.name.trim(),
            email: this.email.trim(),
            password: this.password
        }).subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: () => {
                this.error = 'Registration failed';
                this.loading = false;
            }
        });
    }
}