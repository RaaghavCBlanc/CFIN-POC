import { Component, Input } from '@angular/core';
import { DesktopNavbarComponent } from './desktop-navbar.component';
import { MobileNavbarComponent } from './mobile-navbar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [DesktopNavbarComponent, MobileNavbarComponent],
  template: `
    <nav class="sticky top-0 z-50 w-full bg-charcoal/95 backdrop-blur-sm border-b border-neutral-800/50">
      <div class="max-w-7xl mx-auto w-full px-4 lg:px-6">
        <div class="hidden lg:block w-full">
          @if (data?.left_navbar_items) {
            <app-desktop-navbar
              [locale]="locale"
              [leftNavbarItems]="data.left_navbar_items"
              [rightNavbarItems]="data.right_navbar_items"
              [logo]="data.logo"
            />
          }
        </div>
        <div class="flex h-full w-full items-center lg:hidden">
          @if (data?.left_navbar_items) {
            <app-mobile-navbar
              [locale]="locale"
              [leftNavbarItems]="data.left_navbar_items"
              [rightNavbarItems]="data.right_navbar_items"
              [logo]="data.logo"
            />
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  @Input() data: any;
  @Input() locale = 'en';
}
