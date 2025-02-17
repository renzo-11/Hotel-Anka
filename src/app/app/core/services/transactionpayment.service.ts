import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaymentTransaction {
  paymentId: number; // 🔗 Relacionado con el Payment registrado antes
  paymentMethod: number; // 1 = PayPal, 3 = Tarjeta
  amount: number;  // 💰 Se registra en USD
  currency: string; // "USD"
  status: number;  // 0 = Pending, 1 = Completed, etc.
  externalTransactionId: string; // 📌 ID de PayPal (orderID)
  payerEmail?: string; // 📧 Correo del usuario
  createAt: string;  // 📅 Fecha y hora del pago
  cardHolderName?: string;  // (Solo si paga con tarjeta)
  last4Digits?: string;  // (Solo si paga con tarjeta)
}

@Injectable({
  providedIn: 'root'
})
export class TransactionpaymentService {
  private apiUrl = 'http://www.hotelankaapi.somee.com/api/payment-transactions';

  constructor(private http: HttpClient) {}

  createTransaction(transaction: PaymentTransaction): Observable<any> {
    return this.http.post(`${this.apiUrl}`, transaction);
  }
}
