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
  private apiUrl = 'https://localhost:7004/api/Reservations';  // Tu URL de la API

  constructor(private http: HttpClient) {}

  // Obtener todas las reservaciones
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  // Crear una nueva reservación
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  // Obtener reservaciones por cuarto y fecha
  getReservationsForRoomAndDate(roomId: number, date: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/room/${roomId}/date/${date}`);
  }

  // Obtener horas disponibles para un cuarto y una fecha de check-in
  getAvailableTimes(roomId: number, checkInDate: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/available-times/${roomId}/${checkInDate}`);
  }
}
