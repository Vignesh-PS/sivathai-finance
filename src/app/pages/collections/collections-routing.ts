import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionsComponent } from './collections.component';

const routes: Routes = [{
  path: '',
  component: CollectionsComponent,
  pathMatch: 'full',
},
{
  path: ':streetId',
  loadChildren: ()=> import('./collection-streets/collection-streets.module').then(m => m.CollectionStreetsModule)
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CollectionsRouting {
}
