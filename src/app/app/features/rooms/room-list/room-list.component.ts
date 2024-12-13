// src/app/features/rooms/room-list/room-list.component.ts
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
  selectedRoomType: string = '';
  roomPrice: number = 0;

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRooms();
  }

  fetchRooms(): void {
    this.roomService.getRooms().subscribe((data) => {
      this.rooms = data;
      this.updatePrice();
    });
  }

  updatePrice(): void {
    const selectedRoom = this.rooms.find(
      (room) => room.roomType.toLowerCase() === this.selectedRoomType.toLowerCase()
    );
    this.roomPrice = selectedRoom ? selectedRoom.pricePerNight : 0;
  }

  gotoRoomDetail(rommId: number): void{
    this.router.navigate(['/rooms',rommId]);
  }
}
