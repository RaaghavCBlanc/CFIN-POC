import { Component, Input, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { strapiImage } from '../../utils/utils';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, LogoComponent],
  template: `
    <div class="flex justify-between items-center w-full py-3">
      <app-logo [locale]="locale" [image]="logo?.image" />

      <!-- Actions row -->
      <div class="flex items-center gap-2">
        @for (item of topNavbarItems; track item.title) {
          @if (item.style_variant === 'button_primary' || item.style_variant === 'button_primary,') {
            <a
              [href]="resolveNavUrl(item.URL, item.title)"
              [target]="item.open_newtab ? '_blank' : '_self'"
              class="bg-[#5a8a3c] text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {{ item.title }}
            </a>
          }
          @if (item.style_variant === 'button_secondary' || item.style_variant === 'button_secondary,') {
            <a
              [href]="resolveNavUrl(item.URL, item.title)"
              [target]="item.open_newtab ? '_blank' : '_self'"
              class="bg-[#8b2346] text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {{ item.title }}
            </a>
          }
        }

        <!-- Hamburger -->
        <button (click)="open.set(!open())" class="text-gray-700 ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu overlay -->
      @if (open()) {
        <div class="fixed inset-0 bg-white z-50 flex flex-col overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between w-full px-5 py-4 border-b border-gray-200">
            <app-logo [locale]="locale" [image]="logo?.image" />
            <button (click)="open.set(false)" class="text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search -->
          @if (showSearch) {
            <div class="px-5 py-3">
              <div class="relative">
                <input
                  type="text"
                  [placeholder]="searchPlaceholder || 'Search...'"
                  class="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                />
                <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          }

          <!-- Navigation items -->
          <div class="flex flex-col px-5 py-2">
            @for (navItem of bottomNavbarItems; track navItem.title) {
              @if (navItem.has_dropdown && navItem.dropdown_items?.length) {
                <!-- Accordion item -->
                <div class="border-b border-gray-100">
                  <button
                    (click)="toggleAccordion(navItem.title)"
                    class="flex items-center justify-between w-full py-3 text-left text-gray-700 font-medium text-base"
                  >
                    <span class="flex items-center gap-2">
                      @if (navItem.icon) {
                        <img [src]="getIconUrl(navItem.icon)" [alt]="navItem.title" class="h-5 w-5 object-contain" />
                      }
                      {{ navItem.title }}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-gray-400 transition-transform duration-200"
                      [ngClass]="{'rotate-180': expandedItem() === navItem.title}"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  @if (expandedItem() === navItem.title) {
                    <div class="pl-4 pb-3">
                      @for (child of navItem.dropdown_items; track child.Title) {
                        <a
                          [href]="resolveNavUrl(child.URL, child.Title)"
                          [target]="child.open_newtab ? '_blank' : '_self'"
                          (click)="open.set(false)"
                          class="block py-2 text-sm text-gray-500 hover:text-gray-800"
                        >
                          {{ child.Title }}
                        </a>
                      }
                    </div>
                  }
                </div>
              } @else {
                <!-- Simple link -->
                <a
                  [href]="resolveNavUrl(navItem.URL, navItem.title)"
                  [target]="navItem.open_newtab ? '_blank' : '_self'"
                  (click)="open.set(false)"
                  class="flex items-center gap-2 py-3 text-gray-700 font-medium text-base border-b border-gray-100"
                >
                  @if (navItem.icon) {
                    <img [src]="getIconUrl(navItem.icon)" [alt]="navItem.title" class="h-5 w-5 object-contain" />
                  }
                  {{ navItem.title }}
                </a>
              }
            }
          </div>

          <!-- Bottom buttons -->
          <div class="flex flex-col gap-2 px-5 py-4 mt-auto">
            @for (item of topNavbarItems; track item.title) {
              @if (item.style_variant === 'button_primary' || item.style_variant === 'button_primary,') {
                <a [href]="resolveNavUrl(item.URL, item.title)" [target]="item.open_newtab ? '_blank' : '_self'"
                  class="bg-[#5a8a3c] text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center">
                  {{ item.title }}
                </a>
              }
              @if (item.style_variant === 'button_secondary' || item.style_variant === 'button_secondary,') {
                <a [href]="resolveNavUrl(item.URL, item.title)" [target]="item.open_newtab ? '_blank' : '_self'"
                  class="bg-[#8b2346] text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center">
                  {{ item.title }}
                </a>
              }
              @if (item.style_variant === 'language_switcher') {
                <button class="flex items-center justify-center gap-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700">
                  {{ item.title }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class MobileNavbarComponent {
  @Input() topNavbarItems: any[] = [];
  @Input() bottomNavbarItems: any[] = [];
  @Input() logo: any;
  @Input() locale = 'en';
  @Input() showSearch = false;
  @Input() searchPlaceholder = 'Search...';

  open = signal(false);
  expandedItem = signal<string | null>(null);

  toggleAccordion(title: string) {
    this.expandedItem.set(this.expandedItem() === title ? null : title);
  }

  getIconUrl(icon: any): string {
    return strapiImage(icon?.url);
  }

  resolveNavUrl(rawUrl: string | null | undefined, title: string | null | undefined): string {
    const url = (rawUrl || '').trim();

    if (!url || url === '#') {
      return this.isAuthCta(title) ? `/${this.locale}/sign-up` : '#';
    }

    if (this.isExternalUrl(url) || url.startsWith('#')) {
      return url;
    }

    return this.withLocalePrefix(url);
  }

  private isExternalUrl(url: string): boolean {
    return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:');
  }

  private isAuthCta(title: string | null | undefined): boolean {
    const normalized = (title || '').toLowerCase();
    return normalized.includes('sign in')
      || normalized.includes('log in')
      || normalized.includes('login')
      || normalized.includes('sign up');
  }

  private withLocalePrefix(url: string): string {
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;

    if (normalizedPath === `/${this.locale}` || normalizedPath.startsWith(`/${this.locale}/`)) {
      return normalizedPath;
    }

    return `/${this.locale}${normalizedPath}`;
  }
}
