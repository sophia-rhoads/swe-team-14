import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgIf } from '@angular/common';
import { MovieService } from '../services/movie.services';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-manage-movies',
  imports: [TableModule, FormsModule, SelectModule, ButtonModule, InputTextModule, DialogModule, ReactiveFormsModule],
  templateUrl: './manage-movies.html',
  styleUrl: './manage-movies.scss',
})

// interface MenuTables {
//   name: String;
// }
// interface Data {
//   id: String;
// }

export class ManageMovies {
  // movies$!: Observable<Movie[]>;
  // titles?: string[];
  movies!: Movie[];
  // tables?: MenuTables[];
  // // viewTable?: MenuTables | undefined;
  // dataArr!: Data[];
  visible: boolean = false;

  addMovieForm = new FormGroup({ 
    title: new FormControl("", Validators.required),
    genre: new FormControl("", Validators.required),
    mpaaRating: new FormControl("", Validators.required),
    imdbRating: new FormControl<number>(0, Validators.required),
    director: new FormControl("", Validators.required),
    producer: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    trailerUrl: new FormControl("", Validators.required),
    posterUrl: new FormControl("", Validators.required),
    status: new FormControl("", Validators.required),
  })

  constructor(private movieService: MovieService) {
    
  }

  ngOnInit() {

    this.movieService.getAllMovies().subscribe(data => {
      this.movies = data;
    })
    
    // this.tables = [
    //   { name: 'Movies' },
    //   { name: 'Users' },
    //   { name: 'Promotions' },
    //   { name: 'Showtimes' }
    // ];
    // this.dataArr = [
    //   { id: '' }
    // ]
  }

  showDialog() {
    this.visible = true;
  }

  submitMovie() {
    // const addMovie = this.addMovieForm.value;
    // this.newMovie?.title = this.addMovieForm.get('title').value;

    const newMovie: Movie = {
      title: this.addMovieForm.get('title')?.value!,
      genre: this.addMovieForm.get('genre')?.value!,
      mpaaRating: this.addMovieForm.get('mpaaRating')?.value!,
      imdbRating: this.addMovieForm.get('imdbRating')?.value!,
      director: this.addMovieForm.get('director')?.value!,
      producer: this.addMovieForm.get('producer')?.value!,
      description: this.addMovieForm.get('description')?.value!,
      trailerUrl: this.addMovieForm.get('trailerUrl')?.value!,
      posterUrl: this.addMovieForm.get('posterUrl')?.value!,
      status: this.addMovieForm.get('status')?.value!
    }
    //what to do about id???

    console.log(newMovie.title);
    console.log(newMovie.genre);
    console.log(newMovie);

    this.movieService.postMovie(newMovie).subscribe(
      (response: any) => console.log('Success!', response),
      (error: any) => console.error('Error!', error)
    );

    this.visible = false;
  }
}




