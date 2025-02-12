import { Component, EventEmitter, Output } from '@angular/core';
import { ClientService, Client } from '../../../core/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent {
  @Output() clientCreated = new EventEmitter<number>(); // Emitirá el clientId

  client: Client = {
    clientId: 0,
    firstName: '',
    lastName: '',
    nacionality: '',
    documentType: '',
    documentNumber: '',
    phone: '',
    email: '',
  };

  documentPattern: string = '';

  constructor(private clientService: ClientService, private router: Router) {}

  submitForm(): void {
    this.saveClient();
  }

  saveClient(): void {
    const { clientId, ...clientToSave } = this.client;

    this.clientService.addClient(clientToSave).subscribe({
      next: (savedClient: Client) => {
        alert('Datos guardados correctamente.');
        this.clientCreated.emit(savedClient.clientId); // Emitimos el ID
      },
      error: (err) => {
        console.error('Error al guardar cliente:', err);
      },
    });
    this.router.navigate(['/reservation']);
  }
}
