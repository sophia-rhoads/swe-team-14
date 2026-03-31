import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { MovieDetails } from './movie-details/movie-details';
import { BookingPage } from './booking-page/booking-page';
import { LoginPage } from './login-page/login';
import { RegisterPage } from './registration-page/registration';
import { EditProfile } from './edit-profile/edit-profile';
import { LogoutPage } from './logout-page/logout-page';
import { FavoritesPage } from './favorites-page/favorites-page';
import { OrderHistory } from './order-history/order-history';
import { Admin } from './admin/admin';
import { PasswordChange } from './password-change/password-change';
import { RouterLink } from '@angular/router';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'movie/:id', component: MovieDetails },
    { path: 'booking/:id/:showtime', component: BookingPage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'password', component: PasswordChange},
    { path: 'edit-profile', component: EditProfile},
    { path: 'logout-page', component: LogoutPage},
    { path: 'favorites-page', component: FavoritesPage},
    { path: 'order-history', component: OrderHistory},
    { path: 'admin-page', component: Admin},
    { path: '**', redirectTo: '' } // VERY IMPORTANT
];