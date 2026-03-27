import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location, CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    MenuModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  // Search & Filter
  searchTerm: string = '';
  selectedGenre: string | null = null;

  // Navigation UI
  navTitle: string = 'Browse Catalogue';
  showBackButton: boolean = false;

  // Auth State
  isLoggedIn: boolean = false;
  isAuthPage: boolean = false;

  // Genres
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

  // Profile Dropdown Menu
  get profileMenuItems(): MenuItem[] {

    // NOT LOGGED IN
    if (!this.isLoggedIn) {
      return [
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          command: () => this.router.navigate(['/login'])
        },
        {
          label: 'Register',
          icon: 'pi pi-user-plus',
          command: () => this.router.navigate(['/register'])
        }
      ];
    }

    // LOGGED IN
    return [
      {
        label: 'Edit Profile',
        icon: 'pi pi-user-edit',
        command: () => {
          console.log('Edit Profile clicked'); // placeholder
        }
      },
      {
        label: 'Add Payment Cards',
        icon: 'pi pi-credit-card',
        command: () => {
          console.log('Add Payment clicked'); // placeholder
        }
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  constructor(
    private router: Router,
    private location: Location,

  ) {

    window.addEventListener('storage', () => {
      this.checkLoginStatus();
    });
    this.checkLoginStatus();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        const url = event.url;
        this.checkLoginStatus();

        // Detect auth pages
        this.isAuthPage = url.includes('/login') || url.includes('/register');

        // Home
        if (url === '/' || url.startsWith('/?')) {
          this.navTitle = 'Browse Catalogue';
          this.showBackButton = false;
        }

        // Movie Details
        else if (url.includes('/movie')) {
          const state = history.state;
          this.navTitle = state?.movieTitle || 'Movie Details';
          this.showBackButton = true;
        }

        // Booking
        else if (url.includes('/booking')) {
          const state = history.state;
          const title = state?.movieTitle || 'Movie';
          this.navTitle = `Booking: ${title}`;
          this.showBackButton = true;
        }

        // Login
        else if (url.includes('/login')) {
          this.navTitle = 'Login';
          this.showBackButton = false;
        }

        // Register
        else if (url.includes('/register')) {
          this.navTitle = 'Register';
          this.showBackButton = true;
        }
      });
  }

  // Check login state
  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('user');
  }

  // Back
  goBack() {
    this.location.back();
  }

  // Home
  goHome() {
    this.router.navigateByUrl('/')
  }

  // Search
  onSearch(): void {
    this.router.navigate(['/'], {
      queryParams: {
        title: this.searchTerm || null,
        genre: this.selectedGenre || null
      }
    });
  }

  // Filter
  onFilter(): void {
    this.onSearch();
  }

  // Clear filters
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedGenre = null;
    this.router.navigate(['/']);
  }

  // Logout
  logout() {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}