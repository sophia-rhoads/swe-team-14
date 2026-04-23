import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePickerModule } from 'primeng/datepicker';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MovieService } from '../services/movie.services';
import { ShowtimeService, ShowtimeResponse } from '../services/showtime.services';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, RatingModule,
    ProgressSpinnerModule, DatePickerModule
  ],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.scss']
})
export class MovieDetails implements OnInit {

  movie$!: Observable<Movie>;
  trailerUrl$!: Observable<SafeResourceUrl>;

  allShowtimes: ShowtimeResponse[] = [];
  showtimesLoading = false;
  showtimesError = '';

  selectedDate: Date | null = null;
  disabledDates: Date[] = [];
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

  timeSlotsForDate: ShowtimeResponse[] = [];
  selectedShowtime: ShowtimeResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
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
      this.loadShowtimes(Number(params.get('id')));
    });
  }

  loadShowtimes(movieId: number): void {
    this.showtimesLoading = true;
    this.showtimesError = '';
    this.showtimeService.getShowtimesByMovie(movieId).subscribe({
      next: data => {
        this.allShowtimes = data;
        this.buildDisabledDates();
        this.showtimesLoading = false;

        this.cdr.detectChanges();
      },
      error: () => {
        this.showtimesError = 'Unable to load showtimes.';
        this.showtimesLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private buildDisabledDates(): void {
    const availableStrs = new Set(
      this.allShowtimes.map(st => this.normaliseDate(st.showDate))
    );

    const dates: Date[] = [];
    const cursor = new Date(this.minDate);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(this.maxDate);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      if (!availableStrs.has(this.toLocalDateString(cursor))) {
        dates.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    this.disabledDates = dates;
  }

  // Normalise showDate to "YYYY-MM-DD"
  private normaliseDate(showDate: string | any): string {
    if (typeof showDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(showDate)) {
      return showDate;
    }
    if (Array.isArray(showDate) && showDate.length >= 3) {
      const [y, m, d] = showDate as number[];
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return String(showDate);
  }

  onDateSelected(): void {
    this.selectedShowtime = null;
    this.timeSlotsForDate = [];
    if (!this.selectedDate) return;
    const dateStr = this.toLocalDateString(this.selectedDate);
    this.timeSlotsForDate = this.allShowtimes.filter(
      st => this.normaliseDate(st.showDate) === dateStr
    );
  }

  formatTime(st: ShowtimeResponse): string {
    const timeStr = typeof st.showTime === 'string' ? st.showTime : '';
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  formatVenue(st: ShowtimeResponse): string {
    return st.roomName;
  }

  availableSeats(st: ShowtimeResponse): number {
    return (st.seats || []).filter(s => !s.booked).length;
  }

  selectTimeSlot(st: ShowtimeResponse): void {
    this.selectedShowtime = st;
  }

  goToBooking(movie: Movie): void {
    if (movie.status === 'COMING_SOON' || !this.selectedShowtime) return;
    this.router.navigate(
      ['/booking', movie.id, this.selectedShowtime.id],
      { state: { movieTitle: movie.title } }
    );
  }

  private toLocalDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}