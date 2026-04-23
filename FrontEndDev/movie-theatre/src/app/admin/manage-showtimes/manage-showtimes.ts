import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { ShowtimeService, ShowtimeResponse, ShowroomInfo } from '../../services/showtime.services';
import { MovieService } from '../../services/movie.services';
import { Movie } from '../../models/movie';

@Component({
    selector: 'app-manage-showtimes',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, TableModule],
    templateUrl: './manage-showtimes.html',
    styleUrl: './manage-showtimes.scss'
})
export class ManageShowtimesComponent implements OnInit {

    movies: Movie[] = [];
    showrooms: ShowroomInfo[] = [];
    showtimes: ShowtimeResponse[] = [];

    selectedMovieId: number | null = null;
    selectedRoomId: number | null = null;
    showDate = '';
    showTime = '';

    showtimeError = '';
    showtimeSuccess = '';

    constructor(
        private showtimeService: ShowtimeService,
        private movieService: MovieService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadMovies();
        this.loadShowrooms();
        this.loadShowtimes();
    }

    goBack(): void {
        this.router.navigate(['/admin-page']);
    }

    loadMovies(): void {
        this.movieService.getAllMovies().subscribe({
            next: data => {
                this.movies = data;
                this.cdr.detectChanges();
            },
            error: () => { }
        });
    }

    loadShowrooms(): void {
        this.showtimeService.getShowrooms().subscribe({
            next: data => {
                this.showrooms = data;
                this.cdr.detectChanges();
            },
            error: () => { }
        });
    }

    loadShowtimes(): void {
        this.showtimeService.getAllShowtimes().subscribe({
            next: data => {
                this.showtimes = [...data];
                this.cdr.detectChanges();
            },
            error: () => {
                this.showtimes = [];
                this.cdr.detectChanges();
            }
        });
    }

    addShowtime(): void {
        // Clear both messages before attempt
        this.showtimeError = '';
        this.showtimeSuccess = '';

        if (!this.selectedMovieId || !this.selectedRoomId || !this.showDate || !this.showTime) {
            this.showtimeError = 'Please fill all showtime fields.';
            this.cdr.detectChanges();
            return;
        }

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        const timePattern = /^\d{2}:\d{2}$/;
        if (!datePattern.test(this.showDate)) {
            this.showtimeError = 'Invalid date format. Use the date picker.';
            this.cdr.detectChanges();
            return;
        }
        if (!timePattern.test(this.showTime)) {
            this.showtimeError = 'Invalid time format. Use the time picker.';
            this.cdr.detectChanges();
            return;
        }

        const request = {
            movieId: this.selectedMovieId,
            roomId: this.selectedRoomId,
            showDate: this.showDate,      // YYYY-MM-DD  — matches LocalDate.parse()
            showTime: this.showTime       // HH:mm       — matches LocalTime.parse()
        };

        this.showtimeService.createShowtime(request).subscribe({
            next: (newShowtime: ShowtimeResponse) => {
                this.loadShowtimes();
                this.clearForm();
                // Use setTimeout to let loadShowtimes() complete its async cycle first
                setTimeout(() => {
                    this.showtimeSuccess = `Showtime scheduled successfully for "${newShowtime.movieTitle}".`;
                    this.showtimeError = '';
                    this.cdr.detectChanges();
                }, 100);
            },
            error: err => {
                const msg = typeof err?.error === 'string'
                    ? err.error
                    : 'Failed to add showtime. A conflict may exist for this room and time.';
                this.showtimeError = msg;
                this.showtimeSuccess = '';
                this.cdr.detectChanges();
            }
        });
    }

    deleteShowtime(st: ShowtimeResponse): void {
        if (!confirm(`Remove "${st.movieTitle}" on ${this.formatDate(st.showDate)} at ${this.formatTime(st.showTime)}?`)) return;

        this.showtimeService.deleteShowtime(st.id).subscribe({
            next: () => {
                this.showtimes = this.showtimes.filter(s => s.id !== st.id);
                this.cdr.detectChanges();
                // Reload to sync with backend state
                this.loadShowtimes();
                setTimeout(() => {
                    this.showtimeSuccess = 'Showtime removed successfully.';
                    this.showtimeError = '';
                    this.cdr.detectChanges();
                }, 100);
            },
            error: () => {
                this.showtimeError = 'Failed to remove showtime.';
                this.showtimeSuccess = '';
                this.cdr.detectChanges();
            }
        });
    }

    clearForm(): void {
        this.selectedMovieId = null;
        this.selectedRoomId = null;
        this.showDate = '';
        this.showTime = '';
        this.showtimeError = '';
        this.showtimeSuccess = '';
        this.cdr.detectChanges();
    }

    formatDate(dateInput: string | any): string {
        if (!dateInput) return '';
        const str = typeof dateInput === 'string' ? dateInput : String(dateInput);
        const parts = str.split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return str;
        const [y, m, d] = parts;
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    formatTime(timeInput: string | any): string {
        if (!timeInput) return '';
        const str = typeof timeInput === 'string' ? timeInput : String(timeInput);
        const parts = str.split(':');
        if (parts.length < 2) return str;
        const [h, m] = parts.map(Number);
        if (isNaN(h) || isNaN(m)) return str;
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    countAvailable(st: ShowtimeResponse): number {
        if (!st.seats || st.seats.length === 0) return 0;
        return st.seats.filter(s => !s.booked).length;
    }
}