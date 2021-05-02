import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { OldcollectionstreetfamilyComponent } from './oldcollection-streets-family/oldcollection-streets-family.component';
import { OldcollectionFamilyFormComponent } from './oldcollection-family-form/oldcollection-family-form.component';
import { OldcollectionFamilyComponent } from './oldcollection-family.component';

const routes: Routes = [
  {
  path: '',
  component: OldcollectionFamilyComponent,
  pathMatch: 'full'
},{
  path: ':familyId',
  component: OldcollectionFamilyFormComponent,
  pathMatch: 'full'
},
// {
//   path: ':streetId/:familyId',
//   component: OldcollectionstreetfamilyComponent,
//   pathMatch: 'full'
// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OldcollectionFamilyRouting {
}
