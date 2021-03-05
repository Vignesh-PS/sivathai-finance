import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NbCardModule, NbWindowModule, NbListModule, NbInputModule, NbToggleModule, NbButtonModule, NbSpinnerModule, NbSelectModule, NbDatepickerModule, NbRadioModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ListStreetsFormService } from './list-streets-form/list-streets-form.service';
import { FormsModule } from '@angular/forms';
import { ListStreetsFormComponent } from './list-streets-form/list-streets-form.component';
import { ListStreetsRouting } from './list-streets-routing';
import { ListStreetsComponent } from './list-streets.component';


@NgModule({
  declarations: [ListStreetsComponent, ListStreetsFormComponent],
  imports: [
    CommonModule,
    ListStreetsRouting,
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
    ListStreetsComponent,
    ListStreetsFormComponent
  ],
  providers: [
    ListStreetsFormService,
    DatePipe
  ]
})
export class ListStreetsModule { }
