import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.services';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [FormsModule, CommonModule, ButtonModule, InputTextModule, RouterLink],
    templateUrl: './reset-password.html',
    styleUrls: ['./reset-password.scss']
})
export class ResetPasswordPage implements OnInit, OnDestroy {

    token: string | null = null;
    newPassword = '';
    confirmPassword = '';
    showNewPassword = false;
    showConfirmPassword = false;
    isLoading = false;
    error = '';
    success = '';
    countdown = 5;

    private countdownInterval: ReturnType<typeof setInterval> | null = null;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token');
    }

    ngOnDestroy(): void {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    toggleNewPassword(): void {
        this.showNewPassword = !this.showNewPassword;
    }

    toggleConfirmPassword(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    resetPassword(): void {
        this.error = '';
        this.success = '';

        if (!this.newPassword || !this.confirmPassword) {
            this.error = 'Please fill all fields';
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.error = 'Passwords do not match';
            return;
        }

        if (!this.token) {
            this.error = 'Invalid or missing reset token';
            return;
        }

        this.isLoading = true;

        this.authService.resetPassword(this.token, this.newPassword, this.confirmPassword)
            .subscribe({
                next: () => {
                    this.success = 'Password reset successful!';
                    this.error = '';
                    this.isLoading = false;
                    this.cdr.detectChanges();

                    this.countdown = 5;
                    this.countdownInterval = setInterval(() => {
                        this.countdown--;
                        if (this.countdown === 0) {
                            clearInterval(this.countdownInterval!);
                            window.location.href = '/login';
                        }
                    }, 1000);
                },
                error: (err) => {
                    this.error = typeof err.error === 'string'
                        ? err.error
                        : err.error?.message || 'Reset failed. Please try again.';
                    this.success = '';
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
    }
}