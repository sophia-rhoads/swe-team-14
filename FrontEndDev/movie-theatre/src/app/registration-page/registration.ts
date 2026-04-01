import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        DatePickerModule,
        RouterLink
    ],
    templateUrl: './registration.html',
    styleUrls: ['./registration.scss']
})
export class RegisterPage {

    loading: boolean = false;

    user = {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',

        //Date instead of string
        dateOfBirth: null as Date | null,

        street: '',
        city: '',
        county: '',
        state: '',
        zip: '',

        paymentCards: [] as string[]
    };

    error = '';
    success = '';

    constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

    register() {

        this.error = '';
        this.success = '';
        this.loading = true;

        // Password match
        if (this.user.password !== this.user.confirmPassword) {
            this.error = 'Password Mismatch';
            this.loading = false;
            return;
        }

        // Email validation
        if (!this.user.email.includes('@')) {
            this.error = 'Please enter a proper @email.com address';
            this.loading = false;
            return;
        }

        // Payment card limit
        if (this.user.paymentCards.length > 3) {
            this.error = 'Maximum 3 cards allowed';
            this.loading = false;
            return;
        }

        const payload = {
            ...this.user,
            dateOfBirth: this.user.dateOfBirth
                ? this.user.dateOfBirth.toISOString().split('T')[0]
                : null
        };

        this.auth.register(payload).subscribe({
            next: (res: any) => {
                this.success = 'Registration successful!';
                this.loading = false;
                this.cdr.detectChanges();

                //console.log('Sending payload:', payload);
                //this.router.navigate(['/login']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || err.error || 'Registration failed. Please try again.';
                this.cdr.detectChanges();
            }
        });
    }

    addCard(card: string) {
        if (this.user.paymentCards.length < 3) {
            this.user.paymentCards.push(card);
        }
    }
}