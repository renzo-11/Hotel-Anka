// reservation-form.component.ts
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

  availableTimes: string[] = [];
  maxCheckInDate: string = '';
  minCheckInDate: string = this.getLocalDate();

  constructor(
    private clientService: ClientService,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

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

    const formattedDate = format(new Date(this.reservation.checkInDate), 'yyyy-MM-dd');
    const url = `https://localhost:7004/api/Reservations/available-times/${this.reservation.roomId}/${formattedDate}`;

    this.reservationService.getAvailableTimes(this.reservation.roomId, this.reservation.checkInDate)
      .subscribe(
        (availableTimes) => {
          this.availableTimes = availableTimes;
        },
        (error) => {
          console.error('Error fetching available times:', error);
        }
      );
  }

  selectCheckInTime(time: string): void {
    this.reservation.checkInTime = time;
    this.onCheckInTimeChange();
  }

  onCheckInTimeChange(): void {
    if (this.reservation.checkInTime) {
      const [hours, minutes] = this.reservation.checkInTime.split(':').map(Number);
      const checkInDateTime = new Date();
      checkInDateTime.setHours(hours, minutes);

      const checkOutDateTime = new Date(checkInDateTime);
      checkOutDateTime.setHours(checkInDateTime.getHours() + 5);
      this.reservation.checkOutTime = format(checkOutDateTime, 'HH:mm');
    }
  }

  submitForm(): void {
    this.reservation.reservationDate = this.getLocalDate();

    // Asegúrate de que checkInTime y checkOutTime estén en el formato correcto
    const formattedCheckInTime = this.formatTime(this.reservation.checkInTime);
    const formattedCheckOutTime = this.formatTime(this.reservation.checkOutTime);

    const reservationData: Reservation = {
      clientId: Number(this.reservation.clientId), // Asegúrate de que el ID sea numérico
      roomId: Number(this.reservation.roomId),     // Asegúrate de que el ID sea numérico
      reservationDate: this.reservation.reservationDate,
      checkInDate: this.reservation.checkInDate,
      checkInTime: formattedCheckInTime,
      checkOutTime: formattedCheckOutTime,
      totalAmount: this.reservation.totalAmount,
      reservationStatus: this.reservation.reservationStatus,
    };

    // Verifica los datos antes de enviarlos
    console.log('Datos de la reserva a enviar:', reservationData);

    this.reservationService.createReservation(reservationData).subscribe({
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

  formatTime(time: string): string {
    // Asegura que la hora esté en el formato "HH:mm:ss"
    const timeParts = time.split(':');
    if (timeParts.length === 2) {
      return `${timeParts[0]}:${timeParts[1]}:00`; // Añadir los segundos si no están presentes
    }
    return time; // Si ya tiene el formato adecuado, retorna como está
  }



}
