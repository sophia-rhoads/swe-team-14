import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    SelectModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  searchTerm: string = '';
  selectedGenre: string | null = null;

  genres = [
    { label: 'All Genres', value: null },
    { label: 'Action', value: 'Action' },
    { label: 'Sci-Fi', value: 'Sci-Fi' },
    { label: 'Animation', value: 'Animation' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Adventure', value: 'Adventure' }
  ];

  constructor(private router: Router) { }

  onSearch(): void {
    this.router.navigate(['/'], {
      queryParams: {
        title: this.searchTerm || null,
        genre: this.selectedGenre || null
      }
    });
  }

  onFilter(): void {
    this.router.navigate(['/'], {
      queryParams: {
        title: this.searchTerm || null,
        genre: this.selectedGenre || null
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedGenre = null;
    this.router.navigate(['/']);
  }
}