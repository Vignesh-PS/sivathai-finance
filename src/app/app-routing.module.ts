import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: ()=> import('./pages/home/home.module').then(m => m.HomeModule)
  },{
    path: 'login',
    loadChildren: ()=> import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'list-streets',
    loadChildren: ()=> import('./pages/list-streets/list-streets.module').then(m => m.StreetsModule)
  },
  {
    path: 'list-families',
    loadChildren: ()=> import('./pages/families/families.module').then(m => m.FamiliesModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
