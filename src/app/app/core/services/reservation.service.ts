import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  clientId: number;
  roomId: number;
  reservationDate: string;
  checkInDate: string;
  checkInTime: string;
  checkOutTime: string;
  totalAmount: number;
  reservationStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'https://localhost:7004/api/Reservations';

  constructor(private http: HttpClient) {}

  // Obtener todas las reservaciones
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  // Crear una nueva reservación
  createReservation(reservation: Reservation): Observable<Reservation> {
    const body = {
      clientId: reservation.clientId, // Enviar 'clientId'
      roomId: reservation.roomId,     // Enviar 'roomId'
      reservationDate: reservation.reservationDate, // Enviar 'reservationDate'
      checkInDate: reservation.checkInDate, // Enviar 'checkInDate'
      checkInTime: reservation.checkInTime, // Enviar 'checkInTime'
      checkOutTime: reservation.checkOutTime, // Enviar 'checkOutTime'
      totalAmount: reservation.totalAmount, // Enviar 'totalAmount'
      reservationStatus: reservation.reservationStatus, // Enviar 'reservationStatus'
    };

    return this.http.post<Reservation>(this.apiUrl, body);
  }

  // Obtener reservaciones por cuarto y fecha
  getReservationsForRoomAndDate(roomId: number, date: string): Observable<Reservation[]> {
    const url = `${this.apiUrl}/room/${roomId}/date/${date}`;
    return this.http.get<Reservation[]>(url);
  }

  getAvailableTimes(roomId: number, checkInDate: string): Observable<string[]> {
    const url = `${this.apiUrl}/available-times/${roomId}/${checkInDate}`;
    return this.http.get<string[]>(url);
  }
}
