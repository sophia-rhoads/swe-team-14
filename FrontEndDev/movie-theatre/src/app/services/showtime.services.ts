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
    showDate: string;   // "YYYY-MM-DD"
    showTime: string;   // "HH:mm:ss"
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
    showDate: string;
    showTime: string;
}

// Seat lock interfaces
export interface SeatLockRequest {
    showtimeId: number;
    seatNumbers: string[];
    userId: number;
}

export interface SeatLockResponse {
    sessionToken: string;
    expiresAt: string;   // ISO datetime string "yyyy-MM-dd'T'HH:mm:ss"
}

export interface LockedSeatsResponse {
    lockedSeats: string[];
}

@Injectable({ providedIn: 'root' })
export class ShowtimeService {

    private readonly showtimesUrl = 'http://localhost:8080/api/showtimes';
    private readonly showroomsUrl = 'http://localhost:8080/api/showrooms';
    private readonly seatsUrl = 'http://localhost:8080/api/seats';

    constructor(private http: HttpClient) { }

    getShowtimesByMovie(movieId: number): Observable<ShowtimeResponse[]> {
        return this.http.get<ShowtimeResponse[]>(`${this.showtimesUrl}/movie/${movieId}`);
    }

    getShowtimeById(showtimeId: number): Observable<ShowtimeResponse> {
        return this.http.get<ShowtimeResponse>(`${this.showtimesUrl}/${showtimeId}`);
    }

    getAllShowtimes(): Observable<ShowtimeResponse[]> {
        return this.http.get<ShowtimeResponse[]>(this.showtimesUrl);
    }

    createShowtime(request: ShowtimeRequest): Observable<ShowtimeResponse> {
        return this.http.post<ShowtimeResponse>(this.showtimesUrl, request);
    }

    deleteShowtime(showtimeId: number): Observable<string> {
        return this.http.delete(`${this.showtimesUrl}/${showtimeId}`, { responseType: 'text' });
    }

    getShowrooms(): Observable<ShowroomInfo[]> {
        return this.http.get<ShowroomInfo[]>(this.showroomsUrl);
    }

    // Seat lock API
    // Lock selected seats for 5 minutes. Returns sessionToken + expiresAt.
    lockSeats(req: SeatLockRequest): Observable<SeatLockResponse> {
        return this.http.post<SeatLockResponse>(`${this.seatsUrl}/lock`, req);
    }

    // Release all locks held by this session token.
    releaseLocks(sessionToken: string): Observable<string> {
        return this.http.delete(`${this.seatsUrl}/lock/${sessionToken}`,
            { responseType: 'text' });
    }

    // Get all seat numbers currently locked (by anyone) for a showtime.
    getLockedSeats(showtimeId: number): Observable<LockedSeatsResponse> {
        return this.http.get<LockedSeatsResponse>(`${this.seatsUrl}/locked/${showtimeId}`);
    }

    // Verify the lock for a session token is still active and get its expiry.
    getLockStatus(sessionToken: string): Observable<SeatLockResponse> {
        return this.http.get<SeatLockResponse>(`${this.seatsUrl}/lock/status/${sessionToken}`);
    }
}