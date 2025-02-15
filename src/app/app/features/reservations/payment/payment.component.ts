import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService, Reservation } from '../../../core/services/reservation.service';
import { ClientService, Client } from '../../../core/services/client.service';
import { RoomService, Room } from '../../../core/services/room.service';
import { PaymentService, Payment } from '../../../core/services/payment.service';
import { TransactionpaymentService, PaymentTransaction } from '../../../core/services/transactionpayment.service';

declare var paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  reservationId!: number;
  reservation?: Reservation;
  client?: Client;
  room?: Room;
  loading: boolean = true;
  payPalClientId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private roomService: RoomService,
    private paymentService: PaymentService,
    private transactionpaymentService: TransactionpaymentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const reservationIdParam = params['reservationId'];

      if (!reservationIdParam) {
        console.error("❌ No se proporcionó una ID de reserva.");
        this.router.navigate(['/']);
        return;
      }

      this.reservationId = Number(reservationIdParam);
      
      if (isNaN(this.reservationId)) {
        console.error("❌ ID de reserva inválida.");
        this.router.navigate(['/']);
        return;
      }

      console.log("📌 Reservation ID recibido:", this.reservationId);
      this.loadReservationDetails();
      this.loadPayPalClientId();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.payPalClientId && !document.querySelector('#paypal-sdk')) {
        this.loadPayPalSDK();
      }
    }, 1000);
  }

  private loadReservationDetails(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (res) => {
        if (!res) {
          console.error("❌ Reserva no encontrada.");
          this.router.navigate(['/']);
          return;
        }
        this.reservation = res;
        console.log("📌 Reserva obtenida:", res);
        this.loadClientAndRoom(res.clientId, res.roomId);
      },
      error: (err) => {
        console.error("❌ Error obteniendo reserva:", err);
        this.router.navigate(['/']);
      }
    });
  }

  private loadClientAndRoom(clientId: number, roomId: number): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client) => {
        this.client = client;
        console.log("📌 Cliente obtenido:", client);
        this.checkLoadingState();
      },
      error: (err) => console.error("❌ Error obteniendo cliente:", err)
    });

    this.roomService.getRoomsbyId(roomId).subscribe({
      next: (room) => {
        this.room = room;
        console.log("📌 Habitación obtenida:", room);
        this.checkLoadingState();
      },
      error: (err) => console.error("❌ Error obteniendo habitación:", err)
    });
  }

  private checkLoadingState(): void {
    if (this.client && this.room && this.reservation) {
      this.loading = false;
      setTimeout(() => this.renderPayPalButton(), 500);
    }
  }

  private loadPayPalClientId(): void {
    this.paymentService.getPayPalClientId().subscribe({
      next: (response) => {
        this.payPalClientId = response.clientId;
        console.log("📌 PayPal Client ID:", this.payPalClientId);
        if (!document.querySelector('#paypal-sdk')) {
          this.loadPayPalSDK();
        }
      },
      error: (err) => console.error("❌ Error obteniendo PayPal Client ID:", err)
    });
  }

  private loadPayPalSDK(): void {
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.payPalClientId}&currency=USD`;
    script.onload = () => this.renderPayPalButton();
    document.body.appendChild(script);
  }

  private renderPayPalButton(): void {
    if (!this.reservation?.totalAmount) {
      console.error("❌ Error: No hay monto disponible para la reserva.");
      return;
    }

    const container = document.getElementById('paypal-button-container');
    if (!container || container.children.length > 0) return;

    const amountInUSD = (this.reservation.totalAmount / 3.7).toFixed(2);
    console.log(`💰 Monto en PEN: ${this.reservation.totalAmount} ➡️ Monto en USD: ${amountInUSD}`);

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: amountInUSD }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          console.log("✅ Pago aprobado en PayPal:", details);
      
          const paymentData: Payment = {
            paymentId: 0,
            reservationId: this.reservationId,
            amountPaid: this.reservation?.totalAmount || 0,
            currency: "PEN",
            paymentDate: new Date().toISOString(),
            paymentMethod: 2, // Suponiendo que 2 es PayPal
            paymentStatus: 1, // Estado pagado
            payPalOrderId: details.id,
            ismanualPayment: false
          };
      
          this.paymentService.createPaypalPayment(paymentData).subscribe({
            next: (response) => {
              console.log("📌 Respuesta del backend:", response);
              
              // Verificar que response realmente contiene el paymentId
              if (response && response.paymentId) {
                this.router.navigate(['/receipt'], { queryParams: { paymentId: response.paymentId } });
              } else {
                console.error("❌ Error: No se recibió un paymentId válido.");
              }
            },
            error: (err) => {
              console.error("❌ Error registrando pago en backend:", err);
            }
          });
          
        });
      }
      
      
      
    }).render('#paypal-button-container');
  }
}
