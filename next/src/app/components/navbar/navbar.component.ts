import { Component, Input } from '@angular/core';
import { DesktopNavbarComponent } from './desktop-navbar.component';
import { MobileNavbarComponent } from './mobile-navbar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [DesktopNavbarComponent, MobileNavbarComponent],
  template: `
    <nav class="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div class="max-w-7xl mx-auto w-full px-4 lg:px-8">
        <div class="hidden lg:block w-full">
          @if (data?.top_navbar) {
            <app-desktop-navbar
              [locale]="locale"
              [topNavbarItems]="data.top_navbar"
              [bottomNavbarItems]="data.bottom_navbar"
              [logo]="data.logo"
              [showSearch]="data.show_search"
              [searchPlaceholder]="data.search_placeholder"
            />
          }
        </div>
        <div class="flex h-full w-full items-center lg:hidden">
          @if (data?.top_navbar) {
            <app-mobile-navbar
              [locale]="locale"
              [topNavbarItems]="data.top_navbar"
              [bottomNavbarItems]="data.bottom_navbar"
              [logo]="data.logo"
              [showSearch]="data.show_search"
              [searchPlaceholder]="data.search_placeholder"
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
