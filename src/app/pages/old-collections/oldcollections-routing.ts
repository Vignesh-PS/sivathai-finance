import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OldcollectionsComponent } from './oldcollections.component';

const routes: Routes = [{
  path: '',
  component: OldcollectionsComponent,
  pathMatch: 'full',
},
// {
//   path: ':oldcollectionId',
//   loadChildren: ()=> import('./oldcollection-streets/oldcollection-streets.module').then(m => m.OldcollectionStreetsModule)
// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OldcollectionsRouting {
}
