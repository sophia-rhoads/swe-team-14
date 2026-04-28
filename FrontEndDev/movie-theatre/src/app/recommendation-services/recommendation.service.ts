import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecommendationRequest {
  favoriteMovieIds: number[];
}

export interface Recommendation {
  movieId: number;
  title: string;
  genre: string;
  posterUrl: string;
  imdbRating: number;
  reason: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly baseUrl = 'http://localhost:8081/api/recommendations';

  constructor(private http: HttpClient) {}

  getRecommendations(favoriteMovieIds: number[]): Observable<Recommendation[]> {
    const body: RecommendationRequest = { favoriteMovieIds };
    return this.http.post<Recommendation[]>(this.baseUrl, body);
  }
}