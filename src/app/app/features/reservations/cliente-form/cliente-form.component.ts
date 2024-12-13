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

  // Establece el patrón de validación del número de documento según el tipo de documento seleccionado
  ngOnChanges() {
    this.updateDocumentPattern();
  }

  submitForm(): void {
    this.saveClient();
  }

  updateDocumentPattern(): void {
    switch (this.client.documentType) {
      case 'DNI':
        this.documentPattern = '^[0-9]{8}$';
        break;
      case 'CarnetExtranjeria':
        this.documentPattern = '^[0-9]{12}$';
        break;
      case 'Pasaporte':
        this.documentPattern = '^[A-Za-z0-9]{20}$';
        break;
      default:
        this.documentPattern = '^[A-Za-z0-9]+$';
        break;
    }
  }

  // Guardar cliente con advertencia
  saveClient(): void {
    this.clientService.addClient(this.client).subscribe({
      next: () => {
        alert('Datos guardados. Por favor, revisa si los datos son correctos.');
      },
      error: (err) => {
        console.error('Error al guardar cliente:', err);
      },
    });
  }

  // Actualizar cliente (sin funcionalidad por ahora)
  updateClient(): void {
    console.log('Función de actualizar aún no implementada');
  }

  // Navegar al siguiente paso
  goToNext(): void {
    this.router.navigate(['/reservation']);
  }
}
