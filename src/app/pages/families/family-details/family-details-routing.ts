import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FamilyDetailsComponent } from "./family-details.component";

const routes: Routes = [
  {
    path: '',
    component: FamilyDetailsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FamilyDetailsRouting {
}
