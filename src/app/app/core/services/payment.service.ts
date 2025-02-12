import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private backendUrl = 'http://localhost:5000/api/payments/create-order'; 

  constructor(private http: HttpClient) {}

  createPayPalOrder(amount: number): Observable<any> {
    return this.http.post(this.backendUrl, { amount });
  }
}
