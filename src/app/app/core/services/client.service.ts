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
  private apiUrl = 'http://www.hotelankaapi.somee.com/api/Client';

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

  getClientById(clientId: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${clientId}`);
  }

}
