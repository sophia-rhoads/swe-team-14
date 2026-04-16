export interface Movie {
    id: number;
    title: string;
    genre: string;
    mpaaRating: string;
    imdbRating?: number;
    director: string;
    producer: string;
    description: string;
    trailerUrl: string;
    posterUrl: string;
    status: string;
}