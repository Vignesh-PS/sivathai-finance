import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingsComponent } from './pendings/pendings.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { NbCardModule, NbContextMenuModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import {ReportService} from './report-service.service';


@NgModule({
  declarations: [PendingsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NbCardModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbSelectModule,
    FormsModule
  ],
  providers:[
    ReportService
  ]
})
export class ReportsModule { }
