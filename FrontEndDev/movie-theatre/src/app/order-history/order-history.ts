import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
interface Orders {
  id: number;
  movie: String;
  numTickets: number;
  cost: String;
}
@Component({
  selector: 'app-order-history',
  imports: [TableModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})
export class OrderHistory {
  orders: Orders[] = [
    { id: 1, movie: 'The Matrix', numTickets: 3, cost: '$34' },
    { id: 2, movie: 'Avatar', numTickets: 1, cost: '$12' },
  ]
}