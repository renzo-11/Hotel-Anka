import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './app/features/home/home.component';
import { AboutComponent } from './app/features/about/about.component';
import { RoomListComponent } from './app/features/rooms/room-list/room-list.component';
import { RoomDetailComponent } from './app/features/rooms/room-detail/room-detail.component';
import { ReservationFormComponent } from './app/features/reservations/reservation-form/reservation-form.component';
import { PaymentComponent } from './app/features/reservations/payment/payment.component';
import { ContactComponent } from './app/features/contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'rooms/:id', component: RoomDetailComponent },
  { path: 'reservation', component: ReservationFormComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'contact', component: ContactComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
