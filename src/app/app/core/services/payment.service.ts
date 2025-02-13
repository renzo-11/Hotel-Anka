import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  paymentId?: number; // Puede ser opcional al crear un nuevo pago
  reservationId: number;
  amountPaid: number;  // 💰 Se registra en PEN
  currency: string;    // 💰 "PEN"
  paymentDate: string;
  paymentMethod: number; // 1 para PayPal
  paymentStatus: number; // 0 = Pending, 1 = Completed, etc.
  payPalOrderId: string;
  ismanualPayment: boolean; // false, porque es con PayPal
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:5157/api/payment';

  constructor(private http: HttpClient) {}

  getPayPalClientId(): Observable<any> { 
    return this.http.get<{ clientId: string }>(`${this.apiUrl}/client-id`);
  }

  createOrder(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, { amount });
  }

  createPaypalPayment(payment: Payment): Observable<any> {
    return this.http.post<Payment>(`${this.apiUrl}/PayPal`, payment);
  }

  getbyidpayment(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}`);
  }
}
