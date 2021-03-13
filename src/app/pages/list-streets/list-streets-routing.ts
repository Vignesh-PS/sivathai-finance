import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StreetsComponent } from './list-streets.component';

const routes: Routes = [{
  path: '',
  component: StreetsComponent
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StreetsRouting {
}
