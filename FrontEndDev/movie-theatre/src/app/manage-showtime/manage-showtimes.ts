import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

interface Movie {
  id?: number;
  title: string;
  genre: string;
  status: string;
  mpaaRating: string;
  imdbRating: number | null;
  director: string;
  producer: string;
  description: string;
  trailerUrl: string;
  posterUrl: string;
}

interface Showtime {
  id?: number;
  movie: {
    id: number | null;
    title?: string;
  };
  showDate: string;
  showTime: string;
  showroom: string;
}

@Component({
  selector: 'app-manage-showtimes',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, HttpClientModule],
  templateUrl: './manage-showtimes.html',
  styleUrl: './manage-showtimes.scss'
})
export class ManageShowtimesComponent implements OnInit {
  movies: Movie[] = [];
  showtimes: Showtime[] = [];

  showrooms: string[] = ['Athens AMC Showroom 1', 'Atlanta AMC Showroom 2', 'Buffalo AMC Showroom 3'];

  showtimeForm: Showtime = {
    movie: { id: null },
    showDate: '',
    showTime: '',
    showroom: ''
  };

  showtimeError = '';
  showtimeSuccess = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadShowtimes();
  }

  goBack(): void {
    this.router.navigate(['/admin-page']);
  }

  loadMovies(): void {
    this.http.get<Movie[]>('http://localhost:8081/api/movies').subscribe({
      next: (data) => {
        this.movies = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading movies', err);
      }
    });
  }

  loadShowtimes(): void {
    this.http.get<Showtime[]>('http://localhost:8081/api/showtimes').subscribe({
      next: (data) => {
        this.showtimes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading showtimes', err);
      }
    });
  }

  addShowtime(): void {
    this.showtimeError = '';
    this.showtimeSuccess = '';
    this.cdr.detectChanges();

    if (
      this.showtimeForm.movie.id === null ||
      !this.showtimeForm.showDate ||
      !this.showtimeForm.showTime ||
      !this.showtimeForm.showroom
    ) {
      this.showtimeError = 'Please fill all showtime fields.';
      this.cdr.detectChanges();
      return;
    }

    this.http.post<Showtime>('http://localhost:8081/api/showtimes', this.showtimeForm).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.showtimeError = '';
          this.showtimeSuccess = 'Showtime added successfully.';
          this.cdr.detectChanges();

          setTimeout(() => {
            this.showtimeForm = {
              movie: { id: null },
              showDate: '',
              showTime: '',
              showroom: ''
            };
            this.loadShowtimes();
            this.cdr.detectChanges();
          }, 100);
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.showtimeSuccess = '';
          this.showtimeError = 'Failed to add showtime. Same showroom and time may already exist.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  resetShowtimeForm(): void {
    this.showtimeError = '';
    this.showtimeSuccess = '';

    this.showtimeForm = {
      movie: { id: null },
      showDate: '',
      showTime: '',
      showroom: ''
    };
  }
}