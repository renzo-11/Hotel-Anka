import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  reservationId: number;
  clientId: number;
  roomId: number;
  reservationDate: Date;
  checkInDate: Date;
  checkOutDate: Date;
  checkInTime: string | null; 
  checkOutTime: string  | null; 
  totalAmount: number;
  reservationStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:5157/api/Reservation';

  constructor(private http: HttpClient) {}

  // Obtener todas las reservaciones
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }
  
  // Obtener una reservación por ID
  getReservationById(reservationId: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${reservationId}`);
  }

  // Crear una nueva reservación
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  deleteReservation(reservationId: number): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.apiUrl}/${reservationId}`);
  }

  getReservationsByCheckInDate(checkInDate: string): Observable<Reservation[]> {
    const formattedDate = encodeURIComponent(checkInDate);
    console.log('Enviando fecha al servicio:', formattedDate);
    return this.http.get<Reservation[]>(`${this.apiUrl}/by-checkin-date/${formattedDate}`);
  }
  

}
