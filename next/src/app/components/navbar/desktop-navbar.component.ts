import { Component, Input } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarItemComponent } from './navbar-item.component';
import { ButtonComponent } from '../elements/button.component';
import { LogoComponent } from '../logo/logo.component';
import { LocaleSwitcherComponent } from '../locale-switcher/locale-switcher.component';

@Component({
  selector: 'app-desktop-navbar',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, NavbarItemComponent, ButtonComponent, LogoComponent, LocaleSwitcherComponent],
  template: `
    <div class="w-full flex justify-between items-center py-3">
      <div class="flex flex-row gap-2 items-center">
        <app-logo [locale]="locale" [image]="logo?.image" />
        <div class="flex items-center gap-1.5">
          @for (item of leftNavbarItems; track item.text) {
            <app-navbar-item [href]="'/' + locale + item.URL" [target]="item.target">
              {{ item.text }}
            </app-navbar-item>
          }
        </div>
      </div>
      <div class="flex space-x-2 items-center">
        <app-locale-switcher [currentLocale]="locale" />
        @for (item of rightNavbarItems; track item.text; let i = $index) {
          <app-button
            [variant]="i === rightNavbarItems.length - 1 ? 'primary' : 'simple'"
            [routerLink]="'/' + locale + item.URL"
          >
            {{ item.text }}
          </app-button>
        }
      </div>
    </div>
  `,
})
export class DesktopNavbarComponent {
  @Input() leftNavbarItems: any[] = [];
  @Input() rightNavbarItems: any[] = [];
  @Input() logo: any;
  @Input() locale = 'en';
}
