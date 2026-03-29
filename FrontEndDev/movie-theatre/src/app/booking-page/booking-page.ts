import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.services';
import { Movie } from '../models/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    InputNumberModule,
    DatePickerModule,
    DialogModule
  ],
  templateUrl: './booking-page.html',
  styleUrls: ['./booking-page.scss']
})
export class BookingPage {

  movie$!: Observable<Movie>;

  showTimes!: string;
  selectedDate!: Date;

  adult = 0;
  child = 0;
  senior = 0;

  selectedSeats: string[] = [];
  displayDialog = false;

  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {
    // ✅ Fetch movie
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.movieService.getMovieById(id);
      })
    );
  }

  ngOnInit() {

    // Get showtime from route params
    this.route.paramMap.subscribe(params => {
      const passedShowtime = params.get('showtime');
      if (passedShowtime) {
        this.showTimes = passedShowtime;
      }
    });

    // Get date from query params (PRIMARY SOURCE)
    this.route.queryParams.subscribe(params => {

      if (params['date']) {

        console.log('RAW DATE FROM URL:', params['date']);

        this.selectedDate = new Date(params['date']);

        // Remove timezone offset issues
        this.selectedDate.setHours(0, 0, 0, 0);

        console.log('PARSED DATE:', this.selectedDate);
      }
    });

    const stateDate = history.state?.date;

    if (!this.selectedDate && stateDate) {
      this.selectedDate = new Date(stateDate);
      this.selectedDate.setHours(0, 0, 0, 0);
    }
  }

  // Ticket count
  get totalTickets(): number {
    return this.adult + this.child + this.senior;
  }

  // Seat selection
  selectSeat(seat: string) {
    if (!this.selectedSeats.includes(seat)) {
      if (this.selectedSeats.length >= this.totalTickets) return;
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
    }
  }

  isSelected(seat: string): boolean {
    return this.selectedSeats.includes(seat);
  }

  isDisabled(seat: string): boolean {
    return !this.selectedSeats.includes(seat) &&
      this.selectedSeats.length >= this.totalTickets;
  }

  // Checkout
  proceedToCheckout() {
    if (
      this.totalTickets === 0 ||
      this.selectedSeats.length !== this.totalTickets
    ) return;

    this.displayDialog = true;
  }
}