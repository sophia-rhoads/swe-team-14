import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { MovieDetails } from './movie-details/movie-details';
import { BookingPage } from './booking-page/booking-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'movie/:id', component: MovieDetails },
    { path: 'booking/:id', component: BookingPage },
    { path: '**', redirectTo: '' }   // VERY IMPORTANT
];