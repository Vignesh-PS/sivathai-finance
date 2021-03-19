import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyDetailsComponent } from './family-details.component';
import { FamilyDetailsRouting } from './family-details-routing';
import { NbCardModule, NbWindowModule, NbListModule, NbInputModule, NbToggleModule, NbButtonModule, NbSpinnerModule, NbSelectModule, NbDialogModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AddPeopleDetailsComponent } from './add-people-details/add-people-details.component';



@NgModule({
  declarations: [FamilyDetailsComponent, AddPeopleDetailsComponent],
  imports: [
    CommonModule,
    FamilyDetailsRouting,
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
     NbDialogModule.forChild()
      ]
})
export class FamilyDetailsModule { }
