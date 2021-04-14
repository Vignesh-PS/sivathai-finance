import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import {CoreModule} from './core/core.module';
// import { NbButtonModule, NbLayoutModule, NbThemeModule } from '@nebular/theme';
import {
  NbSidebarModule,
  NbMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbToastrModule, NbCardModule
} from '@nebular/theme';
import {ThemeModule} from './@theme/theme.module';
import { CommonService } from './services/common.service';
import { WebService } from './services/web.service';

@NgModule({
  declarations: [AppComponent, SidebarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    //CoreModule,
    SharedModule,
    AppRoutingModule,
    NbCardModule,
    CoreModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    //NbThemeModule.forRoot({ name: 'default' }),
    ThemeModule.forRoot(),
  ],
  entryComponents: [SidebarComponent],
  providers: [CommonService, WebService],
  bootstrap: [AppComponent]
})
export class AppModule {}
