import { Component } from '@angular/core';
import { ClientService, Client } from '../../../core/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent {
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

  constructor(private clientService: ClientService, private router: Router) {}

  submitForm(): void {
    this.saveClient();
  }

  saveClient(): void {
    const { clientId, ...clientToSave } = this.client;

    this.clientService.addClient(clientToSave).subscribe({
      next: (savedClient: Client) => {
        if (savedClient && savedClient.clientId) {
          this.router.navigate(['/reservation'], { 
            queryParams: { clientId: savedClient.clientId }
          });
        }
      },
      error: () => {
        alert('Hubo un error al registrar el cliente.');
      },
    });
  }
}
