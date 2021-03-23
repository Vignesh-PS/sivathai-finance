import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionStreetsComponent } from './collection-streets.component';

const routes: Routes = [{
  path: '',
  component: CollectionStreetsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CollectionStreetsRouting {
}
