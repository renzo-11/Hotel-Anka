import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';  // Corrige la ruta del import
import { AboutComponent } from './features/about/about.component';  // Corrige la ruta del import
import { RoomListComponent } from './features/rooms/room-list/room-list.component';  // Corrige la ruta del import
import { RoomDetailComponent } from './features/rooms/room-detail/room-detail.component';  // Corrige la ruta del import
import { ReservationFormComponent } from './features/reservations/reservation-form/reservation-form.component';  // Corrige la ruta del import
import { PaymentComponent } from './features/reservations/payment/payment.component';  // Corrige la ruta del import
import { ContactComponent } from './features/contact/contact.component';  // Corrige la ruta del import
import { ClienteFormComponent } from './features/reservations/cliente-form/cliente-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },  // Ruta de inicio
  { path: 'about', component: AboutComponent },  // Ruta "Nosotros"
  { path: 'rooms', component: RoomListComponent },  // Ruta para listar habitaciones
  { path: 'rooms/:roomId', component: RoomDetailComponent },  // Ruta de detalle de habitación con parámetro de id
  { path: 'reservation', component: ReservationFormComponent },  // Ruta para formulario de reserva
  { path: 'payment/:id', component: PaymentComponent },  // Ruta para pago
  { path: 'client', component: ClienteFormComponent}, // Ruta para Formulario Cliente
  { path: 'contact', component: ContactComponent },  // Ruta de contacto
  { path: '**', redirectTo: '', pathMatch: 'full' }  // Ruta de fallback para redirigir a Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configuración de rutas
  exports: [RouterModule]  // Exporta RouterModule para que esté disponible en la aplicación
})
export class AppRoutingModule { }
