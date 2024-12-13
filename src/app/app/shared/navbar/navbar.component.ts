import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Importa Router

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuActive = false;

  constructor(private router: Router) {}  // Inyecta Router en el constructor

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleMenu();
    }
  }

  // Métodos para la navegación
  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToRooms() {
    this.router.navigate(['/rooms']);
  }

  navigateToReservation() {
    this.router.navigate(['/reservation']);
  }

  navigateToPayment() {
    this.router.navigate(['/payment']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }
}
