import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PendingsComponent } from './pendings/pendings.component';
import { OldpendingsComponent } from './oldpendings/oldpendings.component';

const routes: Routes = [
  {
    path: 'pendings/:collectionId',
    component: PendingsComponent
  },{
    path: 'oldpendings',
    component: OldpendingsComponent
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
