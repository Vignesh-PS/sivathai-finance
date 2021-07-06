import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NbCardModule, NbWindowModule, NbListModule, NbInputModule, NbToggleModule, NbButtonModule, NbSpinnerModule, NbSelectModule, NbDatepickerModule, NbRadioModule, NbDialogModule, NbAlertModule, NbAutocompleteModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OldcollectionFamilyFormService } from './oldcollection-family-form/oldcollection-family-form.service';
import { OldcollectionFamilyFormComponent } from './oldcollection-family-form/oldcollection-family-form.component';
import { OldcollectionFamilyRouting } from './oldcollection-family-routing';
import { OldcollectionFamilyComponent } from './oldcollection-family.component';
// import {OldcollectionstreetfamilyComponent} from './oldcollection-streets-family/oldcollection-streets-family.component';


@NgModule({
  declarations: [OldcollectionFamilyComponent, OldcollectionFamilyFormComponent,
    //  OldcollectionstreetfamilyComponent
    ],
  imports: [
    CommonModule,
    OldcollectionFamilyRouting,
    NbCardModule,
    NbListModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule,
     Ng2SmartTableModule,
     NbButtonModule,
     NbWindowModule.forChild(),
     NbSpinnerModule,
     NbDialogModule,
     NbDatepickerModule,
     NbSelectModule,
     NbAutocompleteModule,
     NbAlertModule
    ],
  entryComponents: [
    OldcollectionFamilyComponent,
    OldcollectionFamilyFormComponent,
    // OldcollectionstreetfamilyComponent
  ],
  providers: [
    OldcollectionFamilyFormService,
    DatePipe
  ]
})
export class OldcollectionFamilyModule { }
