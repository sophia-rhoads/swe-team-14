import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MovieService {

    private readonly baseUrl = 'http://localhost:8080/api/movies';

    constructor(private http: HttpClient) { }

    getAllMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(this.baseUrl);
    }

    getMovieById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${this.baseUrl}/${id}`);
    }

    searchMovies(title: string): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/search?title=${title}`);
    }

    filterByGenre(genre: string): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/filter?genre=${genre}`);
    }

    searchByShowDate(date: string): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/show-date?date=${date}`);
    }

    getByStatus(status: string): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/status?status=${status}`);
    }

    // Admin: add a new movie
    postMovie(movie: Partial<Movie>): Observable<Movie> {
        return this.http.post<Movie>(this.baseUrl, movie);
    }

    updateMovie(id: number, movie: Partial<Movie>): Observable<Movie> {
        return this.http.put<Movie>(`${this.baseUrl}/${id}`, movie);
    }

    // Admin: delete a movie
    deleteMovie(id: number): Observable<string> {
        return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    }
}
