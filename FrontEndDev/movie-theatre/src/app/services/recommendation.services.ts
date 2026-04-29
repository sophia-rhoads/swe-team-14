import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class RecommendationService {

    private readonly baseUrl = 'http://localhost:8080/api/recommendations';

    constructor(private http: HttpClient) { }

    /**
     * Fetches AI-generated movie recommendations for the given user.
     */
    getRecommendations(userId: number): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/${userId}`);
    }
}