import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

// FIX: Updated relative paths — this file now lives at
// src/app/edit-profile/order-history/order-history.ts
// so services are two levels up (../../) instead of one (../)
import { AuthService } from '../../services/auth.services';
import { BookingRecord, BookingService } from '../../services/booking.services';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss'
})
export class OrderHistory implements OnInit {

  orders: BookingRecord[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) { this.orders = []; return; }

    this.bookingService.getBookingHistory(userId).subscribe({
      next: orders => { this.orders = orders; },
      error: () => { this.orders = []; }
    });
  }

  // Navigate back to My Profile with the orders tab active
  goBack(): void {
    this.router.navigate(['/edit-profile'], { queryParams: { tab: 'orders' } });
  }
}