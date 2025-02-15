import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService, Payment } from '../../../core/services/payment.service';
import { ReservationService, Reservation } from '../../../core/services/reservation.service';
import { ClientService, Client } from '../../../core/services/client.service';
import { RoomService, Room } from '../../../core/services/room.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  paymentId!: number;
  payment?: Payment;
  reservation?: Reservation;
  client?: Client;
  room?: Room;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log("📌 Parámetros recibidos en Receipt:", params);  // Verifica en consola
  
      this.paymentId = Number(params['paymentId']);
  
     
  
      console.log("✅ Payment ID recibido en Receipt:", this.paymentId);
      this.loadPaymentDetails();
    });
  }
  

  private loadPaymentDetails(): void {
    this.paymentService.getbyidpayment(this.paymentId).subscribe({
      next: (payment) => {
        if (!payment || !payment.payPalOrderId) {
          console.error('⚠️ Error: paypalOrderId no encontrado en payment');
          this.router.navigate(['/']);
          return;
        }
        this.payment = payment;
        console.log('📌 Pago encontrado:', payment);
        this.loadReservationDetails(payment.reservationId);
      },
      error: (err) => {
        console.error('⚠️ Error al obtener payment:', err);
        this.router.navigate(['/']);
      }
    });
  }

  private loadReservationDetails(reservationId: number): void {
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.loadClientAndRoom(reservation.clientId, reservation.roomId);
      },
      error: () => {
        console.error('⚠️ Error al obtener la reserva');
        this.router.navigate(['/']);
      }
    });
  }

  private loadClientAndRoom(clientId: number, roomId: number): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client) => {
        this.client = client;
        this.checkLoadingState();
      },
      error: () => {
        console.error('⚠️ Error al obtener el cliente');
        this.router.navigate(['/']);
      }
    });

    this.roomService.getRoomsbyId(roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.checkLoadingState();
      },
      error: () => {
        console.error('⚠️ Error al obtener la habitación');
        this.router.navigate(['/']);
      }
    });
  }

  private checkLoadingState(): void {
    if (this.client && this.room && this.reservation && this.payment) {
      this.loading = false;
    }
  }

  printReceipt(): void {
    if (!this.payment) return;
    window.print();
  }

  downloadPDF(): void {
    if (!this.payment || !this.reservation || !this.client || !this.room) return;
    
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('HOTEL YURAK ANKA', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('AGRADECEMOS SU PREFERENCIA', 105, 30, { align: 'center' });
    
    autoTable(doc, {
      startY: 40,
      head: [['Detalle', 'Información']],
      body: [
        ['Order PayPal ID', this.payment.payPalOrderId],
        ['Monto Pagado', `${this.payment.amountPaid} USD`],
        ['Reserva ID', this.reservation.reservationId.toString()],
        ['Check-in', `${this.reservation.checkInDate} - ${this.reservation.checkOutDate}`],
        ['Hora Check-in', `${this.reservation.checkInTime} - ${this.reservation.checkOutTime}`],
        ['Número de Habitación', this.room.roomNumber.toString()],
        ['Cliente', `${this.client.firstName} ${this.client.lastName}`],
        ['Correo', this.client.email],
        ['Teléfono', this.client.phone],
        ['Tipo de Documento', this.client.documentType],
        ['Número de Documento', this.client.documentNumber],
      ],
      theme: 'grid',
      styles: { halign: 'center', fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    
    doc.save('recibo.pdf');
  } 
  goToHome(): void {
    this.router.navigate(['/']);
  } 
}
