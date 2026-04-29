import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../services/movie.services';
import { Movie } from '../models/movie';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AuthService } from '../services/auth.services';
import { ProfileService } from '../services/profile.service';
import { RecommendationService } from '../services/recommendation.services';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    RatingModule,
    FormsModule,
    CarouselModule,
    ToggleButtonModule
  ],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})

export class HomePage implements OnInit {
  movies$!: Observable<Movie[]>;
  currentlyRunning$!: Observable<Movie[]>;
  comingSoon$!: Observable<Movie[]>;

  showAllRunning = false;
  showAllComing = false;

  favoriteMap: Set<number> = new Set();
  private favoriteLoadVersion = 0;
  private pendingFavoriteToggles = new Set<number>();

  // Recommendations: Only populated when a customer is logged in. Hidden entirely for guests or when the list is empty after loading.
  recommendedMovies: Movie[] = [];
  recsLoading = false;
  recsLoaded = false;
  showAllRecs = false;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private profileService: ProfileService,
    private recommendationService: RecommendationService,
    private cdr: ChangeDetectorRef
  ) {
    this.movies$ = this.route.queryParams.pipe(
      switchMap(params => {
        const title = params['title'];
        const genre = params['genre'];
        const date = params['date'];

        if (title) return this.movieService.searchMovies(title);
        if (genre) return this.movieService.filterByGenre(genre);
        if (date) return this.movieService.searchByShowDate(date);

        return this.movieService.getAllMovies();
      })
    );

    this.currentlyRunning$ = this.movies$.pipe(
      map(m => m.filter(x => x.status === 'CURRENTLY_RUNNING'))
    );

    this.comingSoon$ = this.movies$.pipe(
      map(m => m.filter(x => x.status === 'COMING_SOON'))
    );
  }

  ngOnInit(): void {
    this.loadFavorites();
    this.loadRecommendations();
  }

  // Recommendations
  loadRecommendations(): void {
    const userId = this.auth.getUserId();
    // Only fetch for logged-in customers — guests see no recommendations section
    if (!userId) return;

    setTimeout(() => {
      this.recsLoading = true;
      this.cdr.detectChanges();
    }, 0);

    this.recommendationService.getRecommendations(userId).subscribe({
      next: movies => {
        setTimeout(() => {
          this.recommendedMovies = movies;
          this.recsLoading = false;
          this.recsLoaded = true;
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => {
        setTimeout(() => {
          this.recommendedMovies = [];
          this.recsLoading = false;
          this.recsLoaded = true;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  toggleRecs(): void {
    this.showAllRecs = !this.showAllRecs;
  }

  // Favorites
  loadFavorites(): void {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.favoriteMap.clear();
      return;
    }

    const requestVersion = ++this.favoriteLoadVersion;

    this.profileService.getFavorites(userId)
      .subscribe(res => {
        if (requestVersion !== this.favoriteLoadVersion) {
          return;
        }

        this.favoriteMap = new Set(res.map(movie => movie.id));
      });
  }

  toggleFavorite(movieId: number): void {
    const userId = this.auth.getUserId();
    if (!userId || this.pendingFavoriteToggles.has(movieId)) return;

    this.pendingFavoriteToggles.add(movieId);

    this.profileService.toggleFavorite(userId, movieId).subscribe(({ favorite }) => {
      const nextFavorites = new Set(this.favoriteMap);

      favorite ? nextFavorites.add(movieId) : nextFavorites.delete(movieId);
      this.favoriteMap = nextFavorites;
      this.pendingFavoriteToggles.delete(movieId);
      this.favoriteLoadVersion++;
      this.profileService.notifyFavoritesChanged();
    }, () => {
      this.pendingFavoriteToggles.delete(movieId);
    });
  }

  getHeartClass(movieId: number): string {
    return this.favoriteMap.has(movieId)
      ? 'pi pi-heart-fill liked'
      : 'pi pi-heart';
  }

  // Naviagation and UI
  toggleRunning() {
    this.showAllRunning = !this.showAllRunning;
  }

  toggleComing() {
    this.showAllComing = !this.showAllComing;
  }

  viewDetails(movie: Movie) {
    this.router.navigate(['/movie', movie.id], {
      state: { movieTitle: movie.title }
    });
  }

  viewAllRecommendations(): void {
    this.router.navigate(['/edit-profile'], { queryParams: { tab: 'recommendations' } });
  }
}
