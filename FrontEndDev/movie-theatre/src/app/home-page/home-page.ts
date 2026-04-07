import { Component } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
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
export class HomePage {
  movies$!: Observable<Movie[]>;
  currentlyRunning$!: Observable<Movie[]>;
  comingSoon$!: Observable<Movie[]>;
  showAllRunning = false;
  showAllComing = false;
  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
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
  // ✅ FAVORITES CONNECTED
  addFavorite(movieId: number) {
    const userId = this.auth.getUserId();
    if (!userId) return;
    this.http.post(
      `http://localhost:8080/api/user/addFav?cId=${userId}&mId=${movieId}`,
      {}
    ).subscribe(() => {
      console.log('Favorite added');
    });
  }
}