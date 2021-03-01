import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed *ngIf="isHeaderNeed">
        <app-header></app-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive *ngIf="isSidebarNeed">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed *ngIf="isFooterNeed">
        <app-footer></app-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
// @ts-ignore
export class OneColumnLayoutComponent {
  @Input() isHeaderNeed:boolean=true;
  @Input() isFooterNeed:boolean=true;
  @Input() isSidebarNeed:boolean=true;
}
