import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

import { AuthService } from '../services/auth.services';
import { BookingRecord, BookingService } from '../services/booking.services';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss'
})
export class OrderHistory implements OnInit {

  orders: BookingRecord[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.orders = [];
      return;
    }

    this.bookingService.getBookingHistory(userId).subscribe({
      next: orders => { this.orders = orders; },
      error: () => { this.orders = []; }
    });
  }
}