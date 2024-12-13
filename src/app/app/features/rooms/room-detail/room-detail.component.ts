import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService, Room } from '../../../core/services/room.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
})
export class RoomDetailComponent implements OnInit {
  roomId?: number;  // Cambiado de roomType a roomId
  roomDetails: Room | null = null;

  constructor(private route: ActivatedRoute, private roomService: RoomService) {}

  ngOnInit(): void {
    // Obtenemos el roomId desde la URL
    this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
    this.fetchRoomDetails();
  }

  fetchRoomDetails(): void {
    // Obtenemos la lista de habitaciones y buscamos la que corresponde al roomId
    this.roomService.getRooms().subscribe((rooms) => {
      this.roomDetails = rooms.find((room) => room.roomId === this.roomId) || null;
    });
  }

  getPrice(): number {
    // Retornamos el precio solo si los detalles de la habitación están disponibles
    return this.roomDetails ? this.roomDetails.pricePerNight : 0;
  }
}

