import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Router } from '@angular/router';

import { MovieService } from '../../services/movie.services';
import { Movie } from '../../models/movie';

@Component({
    selector: 'app-manage-movies',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule
    ],
    templateUrl: './manage-movies.html',
    styleUrl: './manage-movies.scss'
})
export class ManageMovies implements OnInit {

    private movieService = inject(MovieService);
    private cd = inject(ChangeDetectorRef);
    private router = inject(Router);

    movies: Movie[] = [];
    dialogVisible = false;
    editingMovieId: number | null = null;
    submitError = '';
    submitSuccess = '';

    statusOptions = [
        { label: 'Currently Running', value: 'CURRENTLY_RUNNING' },
        { label: 'Coming Soon', value: 'COMING_SOON' }
    ];

    addMovieForm = new FormGroup({
        title: new FormControl('', Validators.required),
        genre: new FormControl('', Validators.required),
        mpaaRating: new FormControl('', Validators.required),
        imdbRating: new FormControl<number | null>(null),
        director: new FormControl('', Validators.required),
        producer: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        trailerUrl: new FormControl('', Validators.required),
        posterUrl: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required)
    });

    ngOnInit(): void {
        this.loadMovies();
    }

    loadMovies(): void {
        this.movieService.getAllMovies().subscribe({
            next: data => {
                this.movies = data;
                this.cd.detectChanges();
            },
            error: () => {
                this.submitError = 'Failed to load movies.';
            }
        });
    }

    showDialog(): void {
        this.editingMovieId = null;
        this.addMovieForm.reset();
        this.submitError = '';
        this.submitSuccess = '';
        this.dialogVisible = true;
    }

    editMovie(movie: Movie): void {
        this.editingMovieId = movie.id;
        this.submitError = '';
        this.submitSuccess = '';
        this.addMovieForm.setValue({
            title: movie.title,
            genre: movie.genre,
            mpaaRating: movie.mpaaRating,
            imdbRating: movie.imdbRating ?? null,
            director: movie.director,
            producer: movie.producer,
            description: movie.description,
            trailerUrl: movie.trailerUrl,
            posterUrl: movie.posterUrl,
            status: movie.status
        });
        this.dialogVisible = true;
    }

    submitMovie(): void {
        if (this.addMovieForm.invalid) return;
        this.submitError = '';
        this.submitSuccess = '';

        const v = this.addMovieForm.value;
        const newMovie: Partial<Movie> = {
            title: v.title!,
            genre: v.genre!,
            mpaaRating: v.mpaaRating!,
            imdbRating: v.imdbRating ?? undefined,
            director: v.director!,
            producer: v.producer!,
            description: v.description!,
            trailerUrl: v.trailerUrl!,
            posterUrl: v.posterUrl!,
            status: v.status!
        };

        const request$ = this.editingMovieId
            ? this.movieService.updateMovie(this.editingMovieId, newMovie)
            : this.movieService.postMovie(newMovie);

        request$.subscribe({
            next: () => {
                this.submitSuccess = `"${newMovie.title}" ${this.editingMovieId ? 'updated' : 'added'} successfully.`;
                this.dialogVisible = false;
                this.editingMovieId = null;
                this.loadMovies();
            },
            error: err => {
                this.submitError = typeof err?.error === 'string'
                    ? err.error
                    : 'Failed to save movie. Please try again.';
            }
        });
    }

    deleteMovie(movie: Movie): void {
        if (!confirm(`Remove "${movie.title}" from the catalogue?`)) return;
        this.submitError = '';
        this.submitSuccess = '';

        this.movieService.deleteMovie(movie.id!).subscribe({
            next: message => {
                this.submitSuccess = message || `"${movie.title}" removed successfully.`;
                this.loadMovies();
            },
            error: err => {
                this.submitError = typeof err?.error === 'string'
                    ? err.error
                    : `Failed to remove "${movie.title}".`;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/admin-page']);
    }
}
