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

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    RatingModule,
    FormsModule,
    CarouselModule
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
    private router: Router
  ) {

    this.movies$ = this.route.queryParams.pipe(
      switchMap(params => {
        const title = params['title'];
        const genre = params['genre'];

        if (title) {
          return this.movieService.searchMovies(title);
        } else if (genre) {
          return this.movieService.filterByGenre(genre);
        } else {
          return this.movieService.getAllMovies();
        }
      })
    );

    this.currentlyRunning$ = this.movies$.pipe(
      map(movies => movies.filter(m => m.status === 'CURRENTLY_RUNNING'))
    );

    this.comingSoon$ = this.movies$.pipe(
      map(movies => movies.filter(m => m.status === 'COMING_SOON'))
    );
  }

  toggleRunning() {
    this.showAllRunning = !this.showAllRunning;
  }

  toggleComing() {
    this.showAllComing = !this.showAllComing;
  }

  viewDetails(id: number) {
    this.router.navigate(['/movie', id]);
  }
}