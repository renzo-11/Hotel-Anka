import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  clientId?: number;
  firstName: string;
  lastName: string;
  nacionality: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:5157/api/Client'; // URL de tu API de clientes

  constructor(private http: HttpClient) {}

  // Método para obtener todos los clientes
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // Método para agregar un nuevo cliente
  addClient(client: Client): Observable<Client> {
    const { clientId, ...clientWithoutId } = client;
    return this.http.post<Client>(this.apiUrl, clientWithoutId);
  }
}
