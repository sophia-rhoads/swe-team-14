import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendationService, Recommendation } from './recommendation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss'
})
export class RecommendationsComponent implements OnInit {
  recommendations: Recommendation[] = [];
  loading = false;
  error = '';

  // replace later with actual favorite ids from your app
  favoriteMovieIds: number[] = [2, 4];

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.loading = true;
    this.error = '';

    this.recommendationService.getRecommendations(this.favoriteMovieIds).subscribe({
      next: (data: Recommendation[]) => {
        this.recommendations = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Recommendation error', err);
        this.error = 'Failed to load recommendations.';
        this.loading = false;
      }
    });
  }
}