import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamiliesComponent } from './families.component';

const routes: Routes = [{
  path: '',
  component: FamiliesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FamiliesRouting {
}
