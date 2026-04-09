import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
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

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const userId = this.auth.getUserId();
    if (!userId) return;

    this.loading = true;

    this.profileService.getFavorites(userId)
      .subscribe({
        next: res => {
          this.favorites = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  removeFavorite(movieId: number) {
    const userId = this.auth.getUserId();
    if (!userId) return;

    this.profileService.removeFavorite(userId, movieId).subscribe(() => {
      this.favorites = this.favorites.filter(m => m.id !== movieId);
    });
  }

  viewDetails(movie: Movie) {
    this.router.navigate(['/movie', movie.id], {
      state: { movieTitle: movie.title }
    });
  }
}
