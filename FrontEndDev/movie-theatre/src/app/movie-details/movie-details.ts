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
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RatingModule,
    ProgressSpinnerModule,
    FormsModule,
    RadioButtonModule,
    DatePickerModule
  ],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.scss']
})
export class MovieDetails {

  showTimes!: string;
  selectedDate!: Date;

  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

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

    const isLoggedIn = !!localStorage.getItem('user');

    // not logged-in flow
    if (!isLoggedIn) {

      const date = this.selectedDate?.toISOString();

      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: `/booking/${id}/${this.showTimes}`,
          date: date
        }
      });

      return;
    }

    // logged-in flow
    this.movie$.subscribe(movie => {
      this.router.navigate(
        ['/booking', id, this.showTimes],
        {
          queryParams: { date: this.selectedDate?.toISOString() },
          state: { movieTitle: movie.title }
        }
      );
    });
  }
}