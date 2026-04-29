import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { MovieDetails } from './movie-details/movie-details';
import { BookingPage } from './booking-page/booking-page';
import { LoginPage } from './login-page/login';
import { RegisterPage } from './registration-page/registration';
import { EditProfile } from './edit-profile/edit-profile';
import { LogoutPage } from './logout-page/logout-page';
import { Admin } from './admin/admin';
import { ManageMovies } from './admin/manage-movies/manage-movies';
import { ManageShowtimesComponent } from './admin/manage-showtimes/manage-showtimes';
import { ResetPasswordPage } from './reset-password/reset-password';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'movie/:id', component: MovieDetails },

    // Route parameter :showtime is now a showtimeId (number), not a time string
    { path: 'booking/:id/:showtime', component: BookingPage },

    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'edit-profile', component: EditProfile },
    { path: 'logout-page', component: LogoutPage },
    { path: 'reset-password', component: ResetPasswordPage },

    // Admin section — guarded, with child routes per sub-page
    {
        path: 'admin-page',
        canActivate: [adminGuard],
        children: [
            { path: '', component: Admin },
            { path: 'movies', component: ManageMovies },
            { path: 'showtimes', component: ManageShowtimesComponent }
        ]
    },

    { path: '**', redirectTo: '' }
];