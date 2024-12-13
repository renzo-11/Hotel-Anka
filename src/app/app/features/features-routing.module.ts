import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },       // Ruta para el componente Home
  { path: 'contact', component: ContactComponent },  // Ruta para el componente Contact
];

@NgModule({
  imports: [RouterModule.forChild(routes)],   // Usamos forChild para cargar rutas específicas del módulo
  exports: [RouterModule]                     // Exportamos RouterModule para que pueda ser usado en FeaturesModule
})
export class FeaturesRoutingModule { }
