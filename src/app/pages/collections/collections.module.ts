import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NbCardModule, NbWindowModule, NbListModule, NbInputModule, NbToggleModule, NbButtonModule, NbSpinnerModule, NbSelectModule, NbDatepickerModule, NbRadioModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CollectionsFormService } from './collections-form/collections-form.service';
import { FormsModule } from '@angular/forms';
import { CollectionsFormComponent } from './collections-form/collections-form.component';
import { CollectionsRouting } from './collections-routing';
import { CollectionsComponent } from './collections.component';


@NgModule({
  declarations: [CollectionsComponent, CollectionsFormComponent],
  imports: [
    CommonModule,
    CollectionsRouting,
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
    CollectionsComponent,
    CollectionsFormComponent
  ],
  providers: [
    CollectionsFormService,
    DatePipe
  ]
})
export class CollectionsModule { }
