import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService, Payment } from '../../../core/services/payment.service';
import { ReservationService, Reservation } from '../../../core/services/reservation.service';
import { ClientService, Client } from '../../../core/services/client.service';
import { RoomService, Room } from '../../../core/services/room.service';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  paymentId!: number;
  payment!: Payment;
  reservation!: Reservation;
  client!: Client;
  room!: Room;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.paymentId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("📌 Payment ID:", this.paymentId);
    this.loadPaymentDetails();
  }

  loadPaymentDetails(): void {
    this.paymentService.getbyidpayment(this.paymentId).subscribe({
      next: (payment) => {
        console.log("📌 Respuesta completa de paymentService:", payment);
        if (!payment || !payment.payPalOrderId) {
          console.error("⚠️ Error: paypalOrderId no encontrado en payment");
        }
        this.payment = payment;
        this.loadReservationDetails(payment.reservationId);
      },
      error: (err) => {
        console.error("⚠️ Error al obtener payment:", err);
        this.loading = false;
      }
    });
    
  }

  loadReservationDetails(reservationId: number): void {
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.loadClientAndRoom(reservation.clientId, reservation.roomId);
      }
    });
  }

  loadClientAndRoom(clientId: number, roomId: number): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client) => {
        this.client = client;
        this.checkLoadingState();
      }
    });

    this.roomService.getRoomsbyId(roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.checkLoadingState();
      }
    });
  }

  checkLoadingState(): void {
    if (this.client && this.room && this.reservation && this.payment) {
      this.loading = false;
    }
  }

  printReceipt(): void {
    window.print();
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('HOLA SOMOS EL HOTEL YURAK ANKA', 10, 10);
    doc.text('AGRADECEMOS SU PREFERENCIA', 10, 20);
    doc.text(`Order PayPal ID: ${this.payment.payPalOrderId}`, 10, 40);
    doc.text(`Monto Pagado: ${this.payment.amountPaid} USD`, 10, 50);
    doc.text(`Reserva ID: ${this.reservation.reservationId}`, 10, 60);
    doc.text(`Check-in: ${this.reservation.checkInDate}  - Check-out: ${this.reservation.checkOutDate}`, 10, 70);
    doc.text(`Hora Check-in: ${this.reservation.checkInTime} - Hora Check-out: ${this.reservation.checkOutTime}`, 10, 80);
    doc.text(`Número de Habitación: ${this.room.roomNumber}`, 10, 90);
    doc.text(`Cliente: ${this.client.firstName} ${this.client.lastName}`, 10, 100);
    doc.text(`Correo: ${this.client.email}`, 10, 110);
    doc.text(`Teléfono: ${this.client.phone}`, 10, 120);
    doc.text(`Tipo de Documento: ${this.client.documentType}`, 10, 130);
    doc.text(`Número de Documento: ${this.client.documentNumber}`, 10, 140);
    doc.save('recibo.pdf');
  }
}
