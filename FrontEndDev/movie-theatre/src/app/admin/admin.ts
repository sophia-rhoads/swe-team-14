import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  constructor(private router: Router) { }

  goToMovies(): void {
    this.router.navigate(['/admin-page/'])
  }

  goToPromotions(): void {
    // keep for later
  }

  goToUsers(): void {
    // keep for later
  }

  goToShowtimes(): void {
    this.router.navigate(['/admin-page/showtimes']);
  }
}