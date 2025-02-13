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
  reservation!: Reservation;
  client!: Client;
  room!: Room;
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
    this.reservationId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("📌 Reservation ID:", this.reservationId);
    this.loadReservationDetails();
    this.loadPayPalClientId();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.payPalClientId && !document.querySelector('#paypal-sdk')) {
        this.loadPayPalSDK();
      }
    }, 1000);
  }

  loadReservationDetails(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (res: Reservation) => {
        this.reservation = res;
        console.log("📌 Reserva obtenida:", res);
        this.loadClientAndRoom(res.clientId, res.roomId);
      },
      error: (err) => {
        console.error("❌ Error obteniendo reserva:", err);
        this.loading = false;
      }
    });
  }

  loadClientAndRoom(clientId: number, roomId: number): void {
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

  checkLoadingState(): void {
    if (this.client && this.room && this.reservation) {
      this.loading = false;
      setTimeout(() => this.renderPayPalButton(), 500);
    }
  }

  loadPayPalClientId(): void {
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

  loadPayPalSDK(): void {
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.payPalClientId}&currency=USD`;
    script.onload = () => this.renderPayPalButton();
    document.body.appendChild(script);
  }

  renderPayPalButton(): void {
    const container = document.getElementById('paypal-button-container');
    if (!container || container.children.length > 0) return;
  
    if (!this.reservation?.totalAmount) {
      console.error("❌ Error: No hay monto disponible para la reserva.");
      return;
    }
  
    const amountInUSD = (this.reservation.totalAmount / 3.7).toFixed(2);
  
    console.log(`💰 Monto en PEN: ${this.reservation.totalAmount} ➡️ Monto en USD: ${amountInUSD}`);
  
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amountInUSD
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          console.log("✅ Pago aprobado:", details);
          const paypalOrderId = details.id;
          const payerEmail = details.payer.email_address;
          const amountInPEN = this.reservation.totalAmount;
          
          const payment: Payment = {
            reservationId: this.reservationId,
            amountPaid: amountInPEN,
            currency: "PEN",
            paymentDate: new Date().toISOString(),
            paymentMethod: 1,
            paymentStatus: 1,
            payPalOrderId: paypalOrderId,
            ismanualPayment: false
          };

          this.paymentService.createPaypalPayment(payment).subscribe({
            next: (response) => {
              console.log("✅ Pago registrado en PEN:", response);

              const transaction: PaymentTransaction = {
                paymentId: response.paymentId,
                paymentMethod: 1,
                amount: parseFloat(amountInUSD),
                currency: "USD",
                status: 1,
                externalTransactionId: paypalOrderId,
                payerEmail: payerEmail,
                createAt: new Date().toISOString()
              };

              this.transactionpaymentService.createTransaction(transaction).subscribe({
                next: (res) => {
                  console.log("✅ Transacción en USD registrada:", res);
                  this.router.navigate(['/receipt', response.paymentId]);
                },
                error: (err) => console.error("❌ Error registrando transacción:", err)
              });
            },
            error: (err) => console.error("❌ Error registrando pago:", err)
          });

          alert(`Pago realizado con éxito por ${details.payer.name.given_name}`);
        });
      }
    }).render('#paypal-button-container');
  }
}
