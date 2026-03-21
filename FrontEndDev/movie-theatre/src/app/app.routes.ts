import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { MovieDetails } from './movie-details/movie-details';
import { BookingPage } from './booking-page/booking-page';
import { EditProfile } from './edit-profile/edit-profile';
import { LoginPage } from './login-page/login-page';
import { LogoutPage } from './logout-page/logout-page';
import { CreateAccount } from './create-account/create-account';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'movie/:id', component: MovieDetails },
    { path: 'booking/:id/:showtime', component: BookingPage },
    { path: 'edit-profile', component: EditProfile},
    { path: 'login-page', component: LoginPage},
    { path: 'logout-page', component: LogoutPage},
    { path: 'create-account', component: CreateAccount},
    { path: '**', redirectTo: '' } // VERY IMPORTANT
];