import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PendingsComponent } from './pendings/pendings.component';

const routes: Routes = [
  {
    path: 'pendings/:collectionId',
    component: PendingsComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ReportsRoutingModule { }
