import { Component, OnInit } from '@angular/core';
import { RoomService, Room } from '../../../core/services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  selectedRoomType: string = '';
  roomPrice: number = 0;

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRooms();
  }

  fetchRooms(): void {
    this.roomService.getRooms().subscribe((data) => {
      this.rooms = data;

      // Si hay habitaciones, establecer el primer tipo como predeterminado
      if (this.rooms.length > 0) {
        this.selectedRoomType = this.rooms[0].roomType;
        this.filterRooms();
        this.updatePrice();
      }
    });
  }

  updatePrice(): void {
    const selectedRoom = this.rooms.find(
      (room) => room.roomType.toLowerCase() === this.selectedRoomType.toLowerCase()
    );
    this.roomPrice = selectedRoom ? selectedRoom.pricePerNight : 0;
  }

  filterRooms(): void {
    // Filtra las habitaciones basadas en el tipo seleccionado
    this.filteredRooms = this.rooms.filter(
      (room) => room.roomType.toLowerCase() === this.selectedRoomType.toLowerCase()
    );
  }

  onRoomTypeChange(): void {
    this.updatePrice();
    this.filterRooms();
  }

  gotoRoomDetail(roomId: number): void {
    this.router.navigate(['/rooms', roomId]);
  }
}
