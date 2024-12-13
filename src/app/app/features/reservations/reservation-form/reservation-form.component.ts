import { Component, OnInit } from '@angular/core';
import { ClientService, Client } from '../../../core/services/client.service';
import { RoomService, Room } from '../../../core/services/room.service';
import { ReservationService, Reservation } from '../../../core/services/reservation.service';
import { Router } from '@angular/router';
import { format, addHours } from 'date-fns';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
})
export class ReservationFormComponent implements OnInit {
  // Agregar la propiedad currentDate para mostrar la fecha actual
  currentDate: Date = new Date();

  clients: Client[] = [];
  rooms: Room[] = [];
  reservation: Reservation = {
    clientId: 0,
    roomId: 0,
    reservationDate: this.getLocalDate(),
    checkInDate: '',
    checkInTime: '',
    checkOutTime: '',
    totalAmount: 0,
    reservationStatus: 'Pending',
  };

  availableCheckInTimes: string[] = [];
  availableTimes: string[] = [];
  maxCheckInDate: string = '';
  minCheckInDate: string = this.getLocalDate();

  allTimes: string[] = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  constructor(
    private clientService: ClientService,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  openNewUserForm() {
    this.router.navigate(['/client']);
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadRooms();
    this.setMaxCheckInDate();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe((clients: Client[]) => {
      this.clients = clients;
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
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(currentDate.getDate() + 3);
    this.maxCheckInDate = format(maxDate, 'yyyy-MM-dd');
  }

  loadAvailableTimes(): void {
    if (!this.reservation.roomId || !this.reservation.checkInDate) {
      this.availableTimes = [];
      return;
    }

    this.reservationService.getAvailableTimes(this.reservation.roomId, this.reservation.checkInDate)
      .subscribe((availableTimes: string[]) => {
        this.availableTimes = availableTimes;
        console.log('Horas disponibles:', this.availableTimes); // Verifica las horas disponibles
      });
  }

  selectCheckInTime(time: string): void {
    this.reservation.checkInTime = time;
    console.log('Hora de check-in seleccionada:', time); // Verifica la hora seleccionada
    this.onCheckInTimeChange();
  }

  onCheckInTimeChange(): void {
    if (this.reservation.checkInTime) {
      const [hours, minutes] = this.reservation.checkInTime.split(':').map(Number);
      const checkInDateTime = new Date();
      checkInDateTime.setHours(hours, minutes);

      const checkOutDateTime = addHours(checkInDateTime, 5);
      this.reservation.checkOutTime = format(checkOutDateTime, 'HH:mm');
    }
  }

  submitForm(): void {
    this.reservation.reservationDate = this.getLocalDate();
    this.reservationService.createReservation(this.reservation).subscribe({
      next: () => {
        alert('¡Reserva guardada exitosamente!');
        this.router.navigate(['/reservations']);
      },
      error: (err) => {
        console.error('Error al guardar la reserva:', err);
        alert('Hubo un error al guardar la reserva');
      },
    });
  }
}
