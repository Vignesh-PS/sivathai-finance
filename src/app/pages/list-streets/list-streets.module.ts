import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NbCardModule, NbWindowModule, NbListModule, NbInputModule, NbToggleModule, NbButtonModule, NbSpinnerModule, NbSelectModule, NbDatepickerModule, NbRadioModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { StreetsFormService } from './list-streets-form/list-streets-form.service';
import { FormsModule } from '@angular/forms';
import { StreetsFormComponent } from './list-streets-form/list-streets-form.component';
import { StreetsRouting } from './list-streets-routing';
import { StreetsComponent } from './list-streets.component';


@NgModule({
  declarations: [StreetsComponent, StreetsFormComponent],
  imports: [
    CommonModule,
    StreetsRouting,
    NbCardModule,
    NbListModule,
    NbInputModule,
    FormsModule,
     Ng2SmartTableModule,
     NbButtonModule,
     NbToggleModule,
     NbWindowModule.forChild(),
     NbSpinnerModule,
     NbSelectModule,
     NbDatepickerModule.forRoot(),
     NbRadioModule
    ],
  entryComponents: [
    StreetsComponent,
    StreetsFormComponent
  ],
  providers: [
    StreetsFormService,
    DatePipe
  ]
})
export class StreetsModule { }
