import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [FormsModule, CommonModule, ButtonModule, InputTextModule, ProgressSpinnerModule, HttpClientModule],
    templateUrl: './reset-password.html',
    styleUrls: ['./reset-password.scss']
})
export class ResetPasswordPage implements OnInit {

    token: string | null = null;

    error: string = '';
    success: string = '';

    newPassword: string = '';
    confirmPassword: string = '';

    showNewPassword: boolean = false;
    showConfirmPassword: boolean = false;

    countdown: number = 5;
    countdownInterval: any;

    isLoading: boolean = false;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.token = this.route.snapshot.queryParamMap.get('token');
    }

    toggleNewPassword() {
        this.showNewPassword = !this.showNewPassword;
    }

    toggleConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
    resetPassword() {

        if (!this.newPassword || !this.confirmPassword) {
            this.error = "Please fill all fields";
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.error = "Passwords do not match";
            return;
        }

        const payload = {
            token: this.token,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword
        };

        console.log("Payload:", payload);

        this.isLoading = true;

        this.http.post('http://localhost:8080/api/auth/reset-password', payload, {
            responseType: 'text'
        })
            .subscribe({
                next: () => {

                    this.success = "✅ Password reset successful!";
                    this.error = '';
                    this.isLoading = false;

                    this.cdr.detectChanges();
                    this.countdown = 5;

                    this.countdownInterval = setInterval(() => {
                        this.countdown--;

                        if (this.countdown === 0) {
                            clearInterval(this.countdownInterval);
                            window.location.href = '/login';
                        }
                    }, 1000);
                },
                error: (err: any) => {

                    this.error = err.error?.message || "Reset failed";
                    this.success = "";

                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);

                    this.cdr.detectChanges();
                    console.error(err);
                }
            });
    }

    ngOnDestroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
}