import { Component, OnInit } from '@angular/core';
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

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private profileService: ProfileService
  ) {
    this.movies$ = this.route.queryParams.pipe(
      switchMap(params => {
        const title = params['title'];
        const genre = params['genre'];

        if (title) return this.movieService.searchMovies(title);
        if (genre) return this.movieService.filterByGenre(genre);

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

  ngOnInit() {
    this.loadFavorites();
  }

  getHeartClass(movieId: number): string {
    return this.favoriteMap.has(movieId)
      ? 'pi pi-heart-fill liked'
      : 'pi pi-heart';
  }

  loadFavorites() {
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

  toggleFavorite(movieId: number) {
    const userId = this.auth.getUserId();
    if (!userId || this.pendingFavoriteToggles.has(movieId)) return;

    this.pendingFavoriteToggles.add(movieId);

    this.profileService.toggleFavorite(userId, movieId)
      .subscribe(({ favorite }) => {
        const nextFavorites = new Set(this.favoriteMap);

        if (favorite) {
          nextFavorites.add(movieId);
        } else {
          nextFavorites.delete(movieId);
        }

        this.favoriteMap = nextFavorites;
        this.pendingFavoriteToggles.delete(movieId);
        this.favoriteLoadVersion++;
        this.profileService.notifyFavoritesChanged();
      }, () => {
        this.pendingFavoriteToggles.delete(movieId);
      });
  }

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
}
