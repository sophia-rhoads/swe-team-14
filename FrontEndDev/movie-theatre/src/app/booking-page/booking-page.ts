import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.services';
import { Movie } from '../models/movie';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';

interface Seats {
  id?: number;
  image?: "./armchair.png";
  clicked?: boolean;
}

const buttonState = false;

@Component({
  selector: 'app-booking-page',
  imports: [ButtonModule, CommonModule, RatingModule, FormsModule, ProgressSpinnerModule, SelectModule, RadioButtonModule, InputNumberModule, CardModule, SelectButtonModule],
  templateUrl: './booking-page.html',
  styleUrl: './booking-page.scss',
})

export class BookingPage implements OnInit {
  showTimes!: string;
  seats: Seats[] = [];
  numSeats!: number;
  movie$!: Observable<Movie>;
  trailerUrl$!: Observable<SafeResourceUrl>;
  public buttonState: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.movieService.getMovieById(id);
      })
    );

    this.trailerUrl$ = this.movie$.pipe(
      map(movie =>
        this.sanitizer.bypassSecurityTrustResourceUrl(movie.trailerUrl)
      )
    );
  }

  ngOnInit(): void {
    this.seats = Array(25).fill(null).map((_, index) => ({
      id: index + 1,
      clicked: false
    }));
    {
      this.route.paramMap.subscribe(params => {
        const passedShowtime = params.get('showtime');
        if (passedShowtime) {
          this.showTimes = passedShowtime;
        }
      });
    }

    // Array.from({length: 25}, (e, i) => i);

    // this.seats.forEach(seat => {
    //   seat.clicked = false;
    //   console.log(seat.clicked);
    // })

  }

  goToBooking(id: number) {
    this.router.navigate(['/booking', id]);
  }

  arr(n: number): Array<number> {
    return Array(n);
  }

  buttonClicked(id?: number): boolean {
    console.log(id);
    console.log(this.seats[id! - 1].clicked);
    this.seats[id! - 1].clicked = !this.seats[id! - 1].clicked;
    console.log(this.seats[id! - 1].clicked);

    if (this.seats[id! - 1].clicked) {
      return true;
    } else {
      return false;
    }

  }

}