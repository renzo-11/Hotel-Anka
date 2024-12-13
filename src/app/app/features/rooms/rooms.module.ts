import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomListComponent } from './room-list/room-list.component';
import { RouterModule } from '@angular/router';
import { RoomDetailComponent } from './room-detail/room-detail.component';



@NgModule({
  declarations: [
    RoomListComponent,
    RoomDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'room-detail/:rommType', component: RoomDetailComponent},
    ]),
  ]
})
export class RoomsModule { }
