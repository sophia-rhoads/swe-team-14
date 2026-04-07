import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location, CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from './services/auth.services';

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

  // Search & Filter State
  searchTerm: string = '';
  selectedGenre: string | null = null;

  // Navigation UI
  navTitle: string = 'Browse Catalogue';
  showBackButton: boolean = false;

  // Authentication State
  isLoggedIn: boolean = false;
  isAuthPage: boolean = false;

  // Genre Options
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
    private location: Location,
    private authService: AuthService
  ) {
    this.checkLoginStatus();

    // Listen for route changes
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

        // Movie
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

        else if (url.includes('/order-history')) {
          this.navTitle = 'Order History';
        }

        else if (url.includes('/edit-profile')) {
          this.navTitle = 'My Profile';
        }

        else if (url.includes('/favorites-page')) {
          this.navTitle = 'Your Favorites';
        }

        // Register
        else if (url.includes('/register')) {
          this.navTitle = 'Register';
          this.showBackButton = true;
        }
      });
  }

  // Login Status Check
  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  // Get Username for Profile Menu
  getUsername(): string {
    const user = this.authService.getCurrentUser();
    return user?.username || '';
  }

  // Navigation Methods
  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  // Search & Filter Methods
  onSearch(): void {
    this.router.navigate(['/'], {
      queryParams: {
        title: this.searchTerm || null,
        genre: this.selectedGenre || null
      }
    });
  }

  onFilter(): void {
    this.onSearch();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedGenre = null;
    this.router.navigate(['/']);
  }

  // Logout Method
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  // Profile Menu Items
  get profileMenuItems(): MenuItem[] {

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

    const username = this.getUsername();

    return [
      {
        label: username,
        icon: 'pi pi-user',
        disabled: true
      },
      {
        separator: true
      },
      {
        label: 'My Profile',
        icon: 'pi pi-user-edit',
        command: () => this.router.navigate(['/edit-profile'])
      },
      {
        label: 'Add Payment Cards',
        icon: 'pi pi-credit-card',
        command: () => this.router.navigate(['/edit-profile'])
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }
}