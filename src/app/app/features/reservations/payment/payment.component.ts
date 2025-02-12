import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationService, Reservation } from '../../../core/services/reservation.service';
import { ClientService, Client } from '../../../core/services/client.service';
import { RoomService, Room } from '../../../core/services/room.service';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  reservationId!: number;
  reservation!: Reservation;
  client!: Client;
  room!: Room;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private roomService: RoomService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('id')); // Obtiene el ID de la URL
    this.loadReservationDetails();
  }

  loadReservationDetails(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (res: Reservation) => {
        this.reservation = res;
        this.loadClientAndRoom(res.clientId, res.roomId);
      },
      error: (err) => {
        console.error('Error al obtener reserva:', err);
        this.loading = false;
      }
    });
  }

  loadClientAndRoom(clientId: number, roomId: number): void {
    this.clientService.getClientById(clientId).subscribe(client => {
      this.client = client;
      this.checkLoadingState();
    });

    this.roomService.getRoomsbyId(roomId).subscribe(room => {
      this.room = room;
      this.checkLoadingState();
    });
  }

  checkLoadingState(): void {
    if (this.client && this.room) {
      this.loading = false;
    }
  }

  payWithPayPal(): void {
    this.paymentService.createPayPalOrder(this.reservation.totalAmount).subscribe({
      next: (response) => {
        window.location.href = response.links[1].href;
      },
      error: (err) => {
        console.error('Error al crear orden de PayPal:', err);
      }
    });
  }

  payWithCard(): void {
    alert('Pago con tarjeta aún no implementado');
  }
}
