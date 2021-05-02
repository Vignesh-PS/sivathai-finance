import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NbCardModule, NbWindowModule, NbListModule, NbInputModule, NbToggleModule, NbButtonModule, NbSpinnerModule, NbSelectModule, NbDatepickerModule, NbRadioModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OldcollectionsFormService } from './oldcollections-form/oldcollections-form.service';
import { FormsModule } from '@angular/forms';
import { OldcollectionsFormComponent } from './oldcollections-form/oldcollections-form.component';
import { OldcollectionsRouting } from './oldcollections-routing';
import { OldcollectionsComponent } from './oldcollections.component';


@NgModule({
  declarations: [OldcollectionsComponent, OldcollectionsFormComponent],
  imports: [
    CommonModule,
    OldcollectionsRouting,
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
    OldcollectionsComponent,
    OldcollectionsFormComponent
  ],
  providers: [
    OldcollectionsFormService,
    DatePipe
  ]
})
export class OldcollectionsModule { }
