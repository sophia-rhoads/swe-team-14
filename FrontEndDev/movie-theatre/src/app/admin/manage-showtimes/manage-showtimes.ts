import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

import { ShowtimeService, ShowtimeResponse, ShowroomInfo } from '../../services/showtime.services';
import { MovieService } from '../../services/movie.services';
import { Movie } from '../../models/movie';

@Component({
    selector: 'app-manage-showtimes',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, InputTextModule],
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
            next: data => { this.movies = data; },
            error: () => { this.setMessage('Failed to load movies.', 'error'); }
        });
    }

    loadShowrooms(): void {
        this.showtimeService.getShowrooms().subscribe({
            next: data => { this.showrooms = data; },
            error: () => { this.setMessage('Failed to load showrooms.', 'error'); }
        });
    }

    loadShowtimes(): void {
        this.showtimeService.getAllShowtimes().subscribe({
            next: data => { this.showtimes = data; },
            error: () => { this.showtimes = []; }
        });
    }

    addShowtime(): void {
        this.showtimeError = '';
        this.showtimeSuccess = '';

        if (!this.selectedMovieId || !this.selectedRoomId || !this.showDate || !this.showTime) {
            this.showtimeError = 'Please fill all showtime fields.';
            return;
        }

        const request = {
            movieId: this.selectedMovieId,
            roomId: this.selectedRoomId,
            showDate: this.showDate,
            showTime: this.showTime
        };

        this.showtimeService.createShowtime(request).subscribe({
            next: () => {
                // setTimeout prevents NG0100 by deferring message assignment past change detection
                setTimeout(() => {
                    this.setMessage('Showtime scheduled successfully.', 'success');
                    this.cdr.detectChanges();
                });
                this.resetForm();
                this.loadShowtimes();
            },
            error: err => {
                const msg = typeof err?.error === 'string'
                    ? err.error
                    : 'Failed to add showtime. A conflict may exist for this room and time.';
                setTimeout(() => {
                    this.setMessage(msg, 'error');
                    this.cdr.detectChanges();
                });
            }
        });
    }

    resetForm(): void {
        this.selectedMovieId = null;
        this.selectedRoomId = null;
        this.showDate = '';
        this.showTime = '';
        this.showtimeError = '';
        this.showtimeSuccess = '';
    }

    formatTime(timeStr: string): string {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        const date = new Date();
        date.setHours(Number(h), Number(m));
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    countAvailable(st: ShowtimeResponse): number {
        return st.seats.filter(s => !s.booked).length;
    }

    private setMessage(msg: string, type: 'success' | 'error'): void {
        this.showtimeError = type === 'error' ? msg : '';
        this.showtimeSuccess = type === 'success' ? msg : '';
    }
}