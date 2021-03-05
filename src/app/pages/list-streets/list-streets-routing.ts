import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStreetsComponent } from './list-streets.component';

const routes: Routes = [{
  path: '',
  component: ListStreetsComponent
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ListStreetsRouting {
}
