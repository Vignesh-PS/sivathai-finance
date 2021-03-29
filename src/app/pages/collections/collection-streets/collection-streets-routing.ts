import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionstreetfamilyComponent } from './collection-streets-family/collection-streets-family.component';
import { CollectionStreetsFormComponent } from './collection-streets-form/collection-streets-form.component';
import { CollectionStreetsComponent } from './collection-streets.component';

const routes: Routes = [
  {
  path: '',
  component: CollectionStreetsComponent,
  pathMatch: 'full'
},{
  path: ':streetId',
  component: CollectionStreetsFormComponent,
  pathMatch: 'full'
},{
  path: ':streetId/:familyId',
  component: CollectionstreetfamilyComponent,
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CollectionStreetsRouting {
}
