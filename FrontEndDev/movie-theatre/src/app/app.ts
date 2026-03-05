import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';

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
    SelectModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  searchTerm: string = '';
  selectedGenre: string | null = null;

  navTitle: string = 'Browse Catalogue';
  showBackButton: boolean = false;

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

  constructor(
    private router: Router,
    private location: Location
  ) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        const url = event.url;

        if (url.startsWith('/?') || url === '/') {
          this.navTitle = 'Browse Catalogue';
          this.showBackButton = false;
        }

        else if (url.includes('/movie')) {

          const state = history.state;
          this.navTitle = state?.movieTitle || 'Movie Details';
          this.showBackButton = true;

        }

        else if (url.includes('/booking')) {

          const state = history.state;
          const title = state?.movieTitle || 'Movie';
          this.navTitle = `Booking Screen: ${title}`;
          this.showBackButton = true;

        }

      });

  }

  goBack() {
    this.location.back();
  }

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