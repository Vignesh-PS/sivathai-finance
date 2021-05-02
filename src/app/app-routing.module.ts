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
    path:'list-families/:familyId',
    loadChildren: ()=> import('./pages/families/family-details/family-details.module').then(m => m.FamilyDetailsModule)
  },
  {
    path: 'list-collections',
    loadChildren: ()=> import('./pages/collections/collections.module').then(m => m.CollectionsModule)
  },
  {
    path: 'list-collections-old',
    loadChildren: ()=> import('./pages/old-collections/oldcollections.module').then(m => m.OldcollectionsModule)
  },
  {
    path: 'list-families-old',
    loadChildren: ()=> import('./pages/old-collections/oldcollection-family/oldcollection-family.module').then(m => m.OldcollectionFamilyModule)
  },
  {
    path: 'reports',
    loadChildren: ()=> import('./pages/reports/reports.module').then(m => m.ReportsModule)
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
