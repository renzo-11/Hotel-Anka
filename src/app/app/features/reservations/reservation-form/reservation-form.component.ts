import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService, Client } from '../../../core/services/client.service';
import { RoomService, Room } from '../../../core/services/room.service';
import { ReservationService, Reservation } from '../../../core/services/reservation.service';
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
  minCheckInDate: string = this.getLocalDate();
  maxCheckInDate: string = '';

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
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private roomService: RoomService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.setMaxCheckInDate();
    this.getClientIdFromQueryParams();
  }

  getLocalDate(): string {
    return format(new Date(), 'yyyy-MM-dd');
  }

  setMaxCheckInDate(): void {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    this.maxCheckInDate = format(maxDate, 'yyyy-MM-dd');
  }

  getClientIdFromQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const clientId = Number(params['clientId']);
      if (!clientId || isNaN(clientId) || clientId <= 0) {
        alert('Debe registrar un cliente antes de hacer una reserva.');
        this.router.navigate(['/cliente']);
        return;
      }
      this.reservation.clientId = clientId;
      this.fetchClientDetails(clientId);
    });
  }

  fetchClientDetails(clientId: number): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (clientData: Client) => {
        this.client = clientData;
      },
      error: () => {
        alert('Error al obtener los datos del cliente.');
      }
    });
  }

  onCheckInDateChange(): void {
    if (!this.reservation.checkInDate) return;

    const checkInDate = new Date(`${this.reservation.checkInDate}T00:00:00`);
    const checkInDateStr = format(checkInDate, 'yyyy-MM-dd');

    this.reservationService.getReservationsByCheckInDate(checkInDateStr).subscribe({
      next: (reservations: Reservation[]) => {
        const reservedRoomIds = reservations.map(res => res.roomId);

        this.roomService.getRooms().subscribe({
          next: (allRooms: Room[]) => {
            this.rooms = allRooms.filter(room => !reservedRoomIds.includes(room.roomId));
            this.reservation.roomId = 0; 
          },
          error: () => alert('Error al obtener las habitaciones'),
        });
      },
      error: () => alert('Error al obtener reservas'),
    });

    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    this.reservation.checkOutDate = format(checkOutDate, 'yyyy-MM-dd') as any;
  }

  fetchAvailableRooms(reservedRoomIds: number[]): void {
    this.roomService.getRooms().subscribe({
      next: (allRooms: Room[]) => {
        this.rooms = allRooms.filter(room => !reservedRoomIds.includes(room.roomId));
        this.reservation.roomId = 0;
      },
      error: () => alert('Error al obtener las habitaciones'),
    });
  }

  onRoomChange(): void {
    const selectedRoom = this.rooms.find(room => Number(room.roomId) === Number(this.reservation.roomId));
    this.reservation.totalAmount = selectedRoom ? selectedRoom.pricePerNight / 2 : 0;
  }

  submitForm(): void {
    if (!this.client) {
      alert('Por favor, registre un cliente antes de continuar.');
      return;
    }
  
    if (!this.reservation.roomId) {
      alert('Por favor, seleccione un cuarto antes de continuar.');
      return;
    }
  
    this.reservation.reservationDate = new Date();
    this.reservation.checkInTime = '12:00:00';
    this.reservation.checkOutTime = '12:00:00';
  
    this.reservationService.createReservation(this.reservation).subscribe({
      next: (newReservation: Reservation) => {
        alert('¡Reserva guardada exitosamente!');
        this.router.navigate(['/payment'], { queryParams: { reservationId: newReservation.reservationId } });
      },
      error: () => {
        alert('Hubo un error al guardar la reserva');
      },
    });
  }
  
  viewRooms(): void {
    if (this.reservation.roomId) {
      this.router.navigate([`/rooms/${this.reservation.roomId}`]);
    } 
  }
  
  
}
