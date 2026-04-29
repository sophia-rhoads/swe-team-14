import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentDetailsPayload {
    paymentCardId?: number | null;
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingZipCode: string;
}

export interface BookingPayload {
    userId: number;
    movieId: number;
    showtimeId?: number | null;
    showDate: string;
    showTime: string;
    adultTickets: number;
    childTickets: number;
    seniorTickets: number;
    seatNumbers: string[];
    confirmationEmail: string;
    sessionToken?: string | null;
    promoCode?: string | null;
    payment: PaymentDetailsPayload;
}

export interface BookingRecord {
    id: number;
    bookingReference: string;
    movieTitle: string;
    posterUrl: string;
    showDate: string;
    showTime: string;
    adultTickets: number;
    childTickets: number;
    seniorTickets: number;
    totalTickets: number;
    seatNumbers: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    promoCode?: string | null;
    totalAmount: number;
    confirmationEmail: string;
    paymentStatus: string;
    paymentCardBrand: string;
    paymentCardLast4: string;
    paymentApprovalCode: string;
    qrCodeDataUrl: string;
    bookedAt: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {

    private readonly baseUrl = 'http://localhost:8080/api/bookings';

    constructor(private http: HttpClient) { }

    checkout(payload: BookingPayload): Observable<BookingRecord> {
        return this.http.post<BookingRecord>(`${this.baseUrl}/checkout`, payload);
    }

    getBookingHistory(userId: number): Observable<BookingRecord[]> {
        return this.http.get<BookingRecord[]>(`${this.baseUrl}/user/${userId}`);
    }
}
