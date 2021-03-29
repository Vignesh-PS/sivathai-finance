import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NbCardModule, NbWindowModule, NbListModule, NbInputModule, NbToggleModule, NbButtonModule, NbSpinnerModule, NbSelectModule, NbDatepickerModule, NbRadioModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CollectionStreetsFormService } from './collection-streets-form/collection-streets-form.service';
import { FormsModule } from '@angular/forms';
import { CollectionStreetsFormComponent } from './collection-streets-form/collection-streets-form.component';
import { CollectionStreetsRouting } from './collection-streets-routing';
import { CollectionStreetsComponent } from './collection-streets.component';
import {CollectionstreetfamilyComponent} from './collection-streets-family/collection-streets-family.component';


@NgModule({
  declarations: [CollectionStreetsComponent, CollectionStreetsFormComponent, CollectionstreetfamilyComponent],
  imports: [
    CommonModule,
    CollectionStreetsRouting,
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
    CollectionStreetsComponent,
    CollectionStreetsFormComponent,
    CollectionstreetfamilyComponent
  ],
  providers: [
    CollectionStreetsFormService,
    DatePipe
  ]
})
export class CollectionStreetsModule { }
