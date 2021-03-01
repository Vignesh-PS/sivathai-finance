import { Component } from '@angular/core';


@Component({
  selector: 'app-empty-layout',
  styleUrls: ['./empty-layout.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
// @ts-ignore
export class EmptyLayoutComponent {}
