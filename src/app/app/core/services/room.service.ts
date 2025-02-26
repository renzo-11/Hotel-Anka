// src/app/services/room.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  roomId: number;
  roomNumber: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  details: string;
  roomStatus: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = 'http://www.hotelankaapi.somee.com/api/Room';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getRoomsbyId(roomId: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${roomId}`);
  }
  
  
}
