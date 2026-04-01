import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';

@Injectable({
    providedIn: 'root'
})
export class MovieService {

    private baseUrl = 'http://localhost:8080/api/movies';

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

    getByStatus(status: string): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/status?status=${status}`);
    }
}