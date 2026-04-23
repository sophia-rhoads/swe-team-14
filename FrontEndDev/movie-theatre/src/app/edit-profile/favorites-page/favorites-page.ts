import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

// Paths are already correct — this file lives at
// src/app/edit-profile/favorites-page/favorites-page.ts
import { AuthService } from '../../services/auth.services';
import { ProfileService } from '../../services/profile.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './favorites-page.html',
  styleUrls: ['./favorites-page.scss']
})
export class FavoritesPage implements OnInit {

  favorites: Movie[] = [];
  loading = false;

  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const userId = this.auth.getUserId();
    if (!userId) return;
    this.loading = true;
    this.profileService.getFavorites(userId).subscribe({
      next: res => { this.favorites = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  removeFavorite(movieId: number): void {
    const userId = this.auth.getUserId();
    if (!userId) return;
    this.profileService.removeFavorite(userId, movieId).subscribe(() => {
      this.favorites = this.favorites.filter(m => m.id !== movieId);
    });
  }

  viewDetails(movie: Movie): void {
    this.router.navigate(['/movie', movie.id], { state: { movieTitle: movie.title } });
  }

  // Navigate back to My Profile with the favorites tab active
  goBack(): void {
    this.router.navigate(['/edit-profile'], { queryParams: { tab: 'favorites' } });
  }
}