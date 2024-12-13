import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { FeaturesRoutingModule } from './features-routing.module';
import { AboutComponent } from './about/about.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent,
    ContactComponent,
    AboutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FeaturesRoutingModule,
    RouterModule,
  ],
  exports: [
    HomeComponent,
    ContactComponent,
    AboutComponent,
  ]
})
export class FeaturesModule { }
