import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';  // Importa SharedModule
import { FeaturesModule } from './features/features.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomsModule } from './features/rooms/rooms.module';
import { RouterModule } from '@angular/router';
import { ReservationsModule } from './features/reservations/reservations.module';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,  // Solo declara AppComponent aquí
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RoomsModule,
    FormsModule,
    CommonModule,
    RouterLink,
    HttpClientModule,
    CoreModule,
    SharedModule,
    FeaturesModule,
    RouterModule,
    ReservationsModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
