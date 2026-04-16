import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MovieService } from '../services/movie.services';
import { ShowtimeService, ShowtimeResponse } from '../services/showtime.services';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, RatingModule,
    ProgressSpinnerModule, RadioButtonModule
  ],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.scss']
})
export class MovieDetails implements OnInit {

  movie$!: Observable<Movie>;
  trailerUrl$!: Observable<SafeResourceUrl>;

  showtimes: ShowtimeResponse[] = [];
  selectedShowtime: ShowtimeResponse | null = null;
  showtimesLoading = false;
  showtimesError = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => this.movieService.getMovieById(Number(params.get('id'))))
    );
    this.trailerUrl$ = this.movie$.pipe(
      map(movie => this.sanitizer.bypassSecurityTrustResourceUrl(movie.trailerUrl))
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const movieId = Number(params.get('id'));
      this.loadShowtimes(movieId);
    });
  }

  loadShowtimes(movieId: number): void {
    this.showtimesLoading = true;
    this.showtimesError = '';
    this.showtimeService.getShowtimesByMovie(movieId).subscribe({
      next: data => {
        this.showtimes = data;
        this.showtimesLoading = false;
      },
      error: () => {
        this.showtimesError = 'Unable to load showtimes.';
        this.showtimesLoading = false;
      }
    });
  }

  // Format showtime for display: "Mon, Apr 21 · 10:00 AM — Showroom 1"
  formatShowtime(st: ShowtimeResponse): string {
    const date = new Date(`${st.showDate}T${st.showTime}`);
    const datePart = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} · ${timePart} — ${st.roomName}`;
  }

  goToBooking(movie: Movie): void {
    if (movie.status === 'COMING_SOON' || !this.selectedShowtime) return;

    this.router.navigate(
      ['/booking', movie.id, this.selectedShowtime.id],
      { state: { movieTitle: movie.title } }
    );
  }
}