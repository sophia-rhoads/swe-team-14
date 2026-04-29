import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {

  constructor(private router: Router) { }

  goToMovies(): void {
    this.router.navigate(['/admin-page/movies']);
  }

  goToShowtimes(): void {
    this.router.navigate(['/admin-page/showtimes']);
  }

  goToPromotions(): void {
    // Placeholder — sprint bonus feature
  }

  goToUsers(): void {
    // Placeholder — not required for this sprint
  }
}