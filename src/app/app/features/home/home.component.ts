import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  title = 'Bienvenidos a Yuraq Anka Web';  

  constructor(private router: Router) { }

  gotoreservation(): void {
    this.router.navigate(['/client'],{
    });
  }
  gotorooms(): void {
    this.router.navigate(['/rooms'],{
    });
  }
}



