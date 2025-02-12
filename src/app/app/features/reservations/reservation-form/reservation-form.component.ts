import { Component, OnInit } from '@angular/core';
import { ClientService, Client } from '../../../core/services/client.service';
import { RoomService, Room } from '../../../core/services/room.service';
import { ReservationService, Reservation } from '../../../core/services/reservation.service';
import { Router } from '@angular/router';
import { format } from 'date-fns';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
})
export class ReservationFormComponent implements OnInit {
  currentDate: Date = new Date();
  rooms: Room[] = [];
  client: Client | null = null;
  maxCheckInDate: string = '';
  minCheckInDate: string = this.getLocalDate();

  reservation: Reservation = {
    reservationId: 0,
    clientId: 0,
    roomId: 0,
    reservationDate: new Date(),
    checkInDate: new Date(),
    checkOutDate: new Date(),
    checkInTime: '12:00:00',
    checkOutTime: '12:00:00',
    totalAmount: 0,
    reservationStatus: 'Pendiente'
  };

  constructor(
    private clientService: ClientService,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLatestClient();
    this.loadRooms();
    this.setMaxCheckInDate();
  }

  loadLatestClient(): void {
    this.clientService.getClients().subscribe((clients: Client[]) => {
      if (clients.length > 0) {
        this.client = clients[clients.length - 1]; 
        if (this.client && this.client.clientId !== undefined) {
          this.reservation.clientId = this.client.clientId;
        }
      }
    });
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    });
  }

  getLocalDate(): string {
    const currentDate = new Date();
    const peruDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'America/Lima' }));
    return format(peruDate, 'yyyy-MM-dd');
  }

  setMaxCheckInDate(): void {
    const maxDate = new Date();
    maxDate.setDate(new Date().getDate() + 3);
    this.maxCheckInDate = format(maxDate, 'yyyy-MM-dd');
  }

  submitForm(): void {
    this.reservation.reservationDate = new Date();
    this.reservation.checkInTime = '12:00:00';
    this.reservation.checkOutTime = '12:00:00';
  
    this.reservationService.createReservation(this.reservation).subscribe({
      next: (newReservation: Reservation) => { 
        alert('¡Reserva guardada exitosamente!');
        this.router.navigate(['/payment', newReservation.reservationId]); 
      },
      error: (err) => {
        console.error('Error al guardar la reserva:', err);
        alert('Hubo un error al guardar la reserva');
      },
    });
  }
  

  navigateToClientForm(): void {
    this.router.navigate(['/client']);
  }
}
