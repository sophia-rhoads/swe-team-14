import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.services';
import { Movie } from '../models/movie';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RatingModule,
    ProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.scss']
})
export class MovieDetails {

  movie$!: Observable<Movie>;
  trailerUrl$!: Observable<SafeResourceUrl>;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.movieService.getMovieById(id);
      })
    );

    this.trailerUrl$ = this.movie$.pipe(
      map(movie =>
        this.sanitizer.bypassSecurityTrustResourceUrl(movie.trailerUrl)
      )
    );
  }

  goToBooking(id: number) {
    this.router.navigate(['/booking', id]);
  }
}