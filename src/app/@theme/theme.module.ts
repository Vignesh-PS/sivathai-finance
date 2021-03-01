import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {
  CORPORATE_THEME,
  COSMIC_THEME, DARK_THEME,
  DEFAULT_THEME,
  NbActionsModule, NbButtonModule, NbCardModule,
  NbContextMenuModule, NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule, NbSelectModule,
  NbSidebarModule, NbThemeModule,
  NbUserModule
} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {EmptyLayoutComponent, OneColumnLayoutComponent, ThreeColumnsLayoutComponent, TwoColumnsLayoutComponent} from './layouts';
import { RouterModule } from '@angular/router';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbCardModule,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  EmptyLayoutComponent
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, RouterModule],
  exports: [CommonModule, ...COMPONENTS],
  declarations: [...COMPONENTS],
})

export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          }).providers,
      ],
    };
  }
}
