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

  searchTerm: string = '';
  selectedGenre: string | null = null;
  selectedShowDate: string = '';

  navTitle: string = 'Browse Catalogue';
  showBackButton: boolean = false;

  isLoggedIn: boolean = false;
  isAuthPage: boolean = false;

  // Track whether the current user is an admin so the toolbar and
  isAdmin: boolean = false;

  // True while the current route is an admin-section page.
  isAdminPage: boolean = false;

  genres = [
    { label: 'All Genres', value: null },
    { label: 'Action', value: 'Action' },
    { label: 'Sci-Fi', value: 'Sci-Fi' },
    { label: 'Animation', value: 'Animation' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Family', value: 'Family' },
    { label: 'War', value: 'War' },
    { label: 'Fantasy', value: 'Fantasy' }
  ];

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {
    this.checkLoginStatus();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.url;
        this.checkLoginStatus();

        this.isAuthPage = url.includes('/login') || url.includes('/register');

        this.isAdminPage = url.includes('/admin-page');

        if (this.isAdmin && !this.isAdminPage && !this.isAuthPage) {
          this.router.navigateByUrl('/admin-page');
          return;
        }

        if (url === '/' || url.startsWith('/?')) {
          this.navTitle = 'Browse Catalogue';
          this.showBackButton = false;
        } else if (url.includes('/movie')) {
          this.navTitle = history.state?.movieTitle || 'Movie Details';
          this.showBackButton = true;
        } else if (url.includes('/booking')) {
          this.navTitle = `Booking: ${history.state?.movieTitle || 'Movie'}`;
          this.showBackButton = true;
        } else if (url.includes('/login')) {
          this.navTitle = 'Login';
          this.showBackButton = false;
        } else if (url.includes('/order-history')) {
          this.navTitle = 'Order History';
        } else if (url.includes('/edit-profile')) {
          this.navTitle = 'My Profile';
        } else if (url.includes('/favorites-page')) {
          this.navTitle = 'Your Favorites';
        } else if (url.includes('/register')) {
          this.navTitle = 'Register';
          this.showBackButton = true;
        } else if (url.includes('/admin-page')) {
          this.navTitle = 'Admin Dashboard';
          this.showBackButton = false;
        }
      });
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
  }

  getUsername(): string {
    return this.authService.getCurrentUser()?.username || '';
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    // Admins go to the admin dashboard; customers go to the movie catalogue.
    if (this.isAdmin) {
      this.router.navigate(['/admin-page']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onSearch(): void {
    this.router.navigate(['/'], {
      queryParams: {
        title: this.searchTerm || null,
        genre: this.selectedGenre || null,
        date: this.selectedShowDate || null
      }
    });
  }

  onFilter(): void {
    this.onSearch();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedGenre = null;
    this.selectedShowDate = '';
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }

  get profileMenuItems(): MenuItem[] {
    if (!this.isLoggedIn) {
      return [
        { label: 'Login', icon: 'pi pi-sign-in', command: () => this.router.navigate(['/login']) },
        { label: 'Register', icon: 'pi pi-user-plus', command: () => this.router.navigate(['/register']) }
      ];
    }

    const username = this.getUsername();

    // Admin menu
    if (this.isAdmin) {
      return [
        { label: username, icon: 'pi pi-shield', disabled: true },
        { separator: true },
        { label: 'Admin Dashboard', icon: 'pi pi-th-large', command: () => this.router.navigate(['/admin-page']) },
        { label: 'Manage Movies', icon: 'pi pi-video', command: () => this.router.navigate(['/admin-page/movies']) },
        { label: 'Manage Showtimes', icon: 'pi pi-calendar', command: () => this.router.navigate(['/admin-page/showtimes']) },
        { separator: true },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
      ];
    }

    // Customer menu
    return [
      { label: username, icon: 'pi pi-user', disabled: true },
      { separator: true },
      { label: 'My Profile', icon: 'pi pi-user-edit', command: () => this.router.navigate(['/edit-profile'], { queryParams: { tab: 'profile' } }) },
      { label: 'Recommendations', icon: 'pi pi-sparkles', command: () => this.router.navigate(['/edit-profile'], { queryParams: { tab: 'recommendations' } }) },
      { label: 'My Favorites', icon: 'pi pi-heart', command: () => this.router.navigate(['/edit-profile'], { queryParams: { tab: 'favorites' } }) },
      { label: 'Order History', icon: 'pi pi-receipt', command: () => this.router.navigate(['/edit-profile'], { queryParams: { tab: 'orders' } }) },
      { label: 'Add Payment Cards', icon: 'pi pi-credit-card', command: () => this.router.navigate(['/edit-profile'], { queryParams: { tab: 'payments' } }) },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }
}
