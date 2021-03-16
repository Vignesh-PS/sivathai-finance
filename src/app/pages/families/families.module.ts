import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NbCardModule, NbWindowModule, NbListModule, NbInputModule, NbToggleModule, NbButtonModule, NbSpinnerModule, NbSelectModule, NbDatepickerModule, NbRadioModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FamiliesFormService } from './families-form/families-form.service';
import { FormsModule } from '@angular/forms';
import { FamiliesFormComponent } from './families-form/families-form.component';
import { FamiliesRouting } from './families-routing';
import { FamiliesComponent } from './families.component';


@NgModule({
  declarations: [FamiliesComponent, FamiliesFormComponent],
  imports: [
    CommonModule,
    FamiliesRouting,
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
    FamiliesComponent,
    FamiliesFormComponent
  ],
  providers: [
    FamiliesFormService,
    DatePipe
  ]
})
export class FamiliesModule { }
