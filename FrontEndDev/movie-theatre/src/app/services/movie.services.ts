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

    //New post method, dunno if this works
    postMovie(movieInfo: Movie): Observable<Movie> {
        console.log("something happening!");
        console.log(movieInfo);
        //not set up properly yet
        return this.http.post<Movie>(`${this.baseUrl}/post`, movieInfo);
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