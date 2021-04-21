import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingsComponent } from './pendings/pendings.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';



@NgModule({
  declarations: [PendingsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NbCardModule,
    NbSpinnerModule
  ]
})
export class ReportsModule { }
