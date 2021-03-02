import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbSidebarModule,
  NbLayoutModule,
  NbButtonModule,
  NbIconModule,
  NbMenuModule,
  NbActionsModule,
  NbCardModule,
  NbInputModule, NbSpinnerModule
} from '@nebular/theme';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login-routing.module';
// import {ThemeModule} from '../@theme/theme.module';
import { FormsModule as ngFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    //ThemeModule,
    NbInputModule,
    LoginRoutingModule,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbIconModule,
    NbMenuModule,
    NbActionsModule,
    NbCardModule,
    ngFormsModule,
    NbSpinnerModule
  ]
})
export class LoginModule { }
