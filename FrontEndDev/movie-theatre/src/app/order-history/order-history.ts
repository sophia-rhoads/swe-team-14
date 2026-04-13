import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.services';
import { BookingRecord, BookingService } from '../services/booking.services';

@Component({
  selector: 'app-order-history',
  imports: [TableModule, CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})

export class OrderHistory {
  orders: BookingRecord[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService
  ) { }

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.orders = [];
      return;
    }

    this.bookingService.getBookingHistory(userId).subscribe({
      next: orders => {
        this.orders = orders;
      },
      error: () => {
        this.orders = [];
      }
    });
  }
}