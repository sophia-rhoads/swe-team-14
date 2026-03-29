import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { MovieDetails } from './movie-details/movie-details';
import { BookingPage } from './booking-page/booking-page';
import { LoginPage } from './login-page/login';
import { RegisterPage } from './registration-page/registration';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'movie/:id', component: MovieDetails },
    { path: 'booking/:id/:showtime', component: BookingPage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: '**', redirectTo: '' }   // VERY IMPORTANT
];