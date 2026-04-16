import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SeatInfo {
    id: number;
    seatNumber: string;
    booked: boolean;
}

export interface ShowtimeResponse {
    id: number;
    movieId: number;
    movieTitle: string;
    roomId: number;
    roomName: string;
    showDate: string;   // YYYY-MM-DD
    showTime: string;   // HH:mm:ss
    seats: SeatInfo[];
}

export interface ShowroomInfo {
    id: number;
    name: string;
    capacity: number;
}

export interface ShowtimeRequest {
    movieId: number;
    roomId: number;
    showDate: string;   // YYYY-MM-DD
    showTime: string;   // HH:mm
}

@Injectable({ providedIn: 'root' })
export class ShowtimeService {

    private readonly showtimesUrl = 'http://localhost:8080/api/showtimes';
    private readonly showroomsUrl = 'http://localhost:8080/api/showrooms';

    constructor(private http: HttpClient) { }

    // User portal: showtimes for a specific movie
    getShowtimesByMovie(movieId: number): Observable<ShowtimeResponse[]> {
        return this.http.get<ShowtimeResponse[]>(`${this.showtimesUrl}/movie/${movieId}`);
    }

    // Booking page: single showtime with full seat map
    getShowtimeById(showtimeId: number): Observable<ShowtimeResponse> {
        return this.http.get<ShowtimeResponse>(`${this.showtimesUrl}/${showtimeId}`);
    }

    // Admin: all showtimes
    getAllShowtimes(): Observable<ShowtimeResponse[]> {
        return this.http.get<ShowtimeResponse[]>(this.showtimesUrl);
    }

    // Admin: create a showtime
    createShowtime(request: ShowtimeRequest): Observable<ShowtimeResponse> {
        return this.http.post<ShowtimeResponse>(this.showtimesUrl, request);
    }

    // Admin: all showrooms for dropdown — separate URL avoids Spring path variable conflict
    getShowrooms(): Observable<ShowroomInfo[]> {
        return this.http.get<ShowroomInfo[]>(this.showroomsUrl);
    }
}