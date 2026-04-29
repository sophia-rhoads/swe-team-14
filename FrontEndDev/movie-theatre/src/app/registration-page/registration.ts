import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        FormsModule, CommonModule, InputTextModule, ButtonModule,
        DatePickerModule, SelectModule, CheckboxModule, RouterLink
    ],
    templateUrl: './registration.html',
    styleUrls: ['./registration.scss']
})
export class RegisterPage {

    loading = false;
    showPassword = false;
    showConfirmPassword = false;

    countryCodes = [
        { label: '+1 (USA)', value: '+1' },
        { label: '+91 (India)', value: '+91' },
        { label: '+44 (UK)', value: '+44' }
    ];

    user = {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        countryCode: '+1',
        dateOfBirth: null as Date | null,
        promotions: false
    };

    error = '';
    success = '';

    constructor(private auth: AuthService, private cdr: ChangeDetectorRef) { }

    register() {
        this.error = '';
        this.success = '';
        this.loading = true;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
            this.error = 'Please enter a valid email address';
            this.loading = false;
            return;
        }

        if (this.user.password.trim() !== this.user.confirmPassword.trim()) {
            this.error = 'Passwords do not match';
            this.loading = false;
            return;
        }

        if (!/^[0-9]{10}$/.test(this.user.phoneNumber)) {
            this.error = 'Phone number must be exactly 10 digits';
            this.loading = false;
            return;
        }

        const payload = {
            username: this.user.username,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            password: this.user.password,
            confirmPassword: this.user.confirmPassword,
            phone: this.user.countryCode + this.user.phoneNumber,
            dateOfBirth: this.user.dateOfBirth
                ? this.user.dateOfBirth.toISOString().split('T')[0]
                : null,
            promotions: this.user.promotions
        };

        this.auth.register(payload).subscribe({
            next: (res) => {
                this.success = res;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loading = false;
                this.error = typeof err.error === 'string'
                    ? err.error
                    : err.error?.message || 'Registration failed';
                this.cdr.detectChanges();
            }
        });
    }
}