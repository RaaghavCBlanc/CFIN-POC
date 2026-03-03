import { Component, Input, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../elements/button.component';
import { LogoComponent } from '../logo/logo.component';
import { LocaleSwitcherComponent } from '../locale-switcher/locale-switcher.component';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, ButtonComponent, LogoComponent, LocaleSwitcherComponent],
  template: `
    <div class="flex justify-between items-center w-full py-2">
      <app-logo [locale]="locale" [image]="logo?.image" />
      <button (click)="open.set(!open())" class="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      @if (open()) {
        <div class="fixed inset-0 bg-black z-50 flex flex-col items-start justify-start space-y-10 pt-5 text-xl text-zinc-600 transition duration-200 hover:text-zinc-800">
          <div class="flex items-center justify-between w-full px-5">
            <app-logo [locale]="locale" [image]="logo?.image" />
            <div class="flex items-center space-x-2">
              <app-locale-switcher [currentLocale]="locale" />
              <button (click)="open.set(false)" class="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex flex-col items-start justify-start gap-[14px] px-8">
            @for (navItem of leftNavbarItems; track navItem.text) {
              @if (navItem.children && navItem.children.length > 0) {
                @for (child of navItem.children; track child.text) {
                  <a [routerLink]="'/' + locale + child.URL" (click)="open.set(false)" class="relative max-w-[15rem] text-left text-2xl">
                    <span class="block text-white">{{ child.text }}</span>
                  </a>
                }
              } @else {
                <a [routerLink]="'/' + locale + navItem.URL" (click)="open.set(false)" class="relative">
                  <span class="block text-[26px] text-white">{{ navItem.text }}</span>
                </a>
              }
            }
          </div>
          <div class="flex flex-row w-full items-start gap-2.5 px-8 py-4">
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
      }
    </div>
  `,
})
export class MobileNavbarComponent {
  @Input() leftNavbarItems: any[] = [];
  @Input() rightNavbarItems: any[] = [];
  @Input() logo: any;
  @Input() locale = 'en';

  open = signal(false);
}
