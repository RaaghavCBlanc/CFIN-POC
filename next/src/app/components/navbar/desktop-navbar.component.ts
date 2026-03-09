import { Component, Input, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { strapiImage } from '../../utils/utils';

@Component({
  selector: 'app-desktop-navbar',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, LogoComponent],
  template: `
    <!-- TOP ROW: Logo + Search + Action Buttons + Language -->
    <div class="flex items-center justify-between py-4">
      <!-- Logo -->
      <app-logo [locale]="locale" [image]="logo?.image" />

      <!-- Right side: Search + Buttons + Language -->
      <div class="flex items-center gap-3">
        <!-- Search bar -->
        @if (showSearch) {
          <div class="relative">
            <input
              type="text"
              [placeholder]="searchPlaceholder || 'Search...'"
              class="border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm text-gray-700 w-56 focus:outline-none focus:border-gray-400"
            />
            <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        }

        <!-- Top navbar items (Join CFIN, Sign In, Language Switcher) -->
        @for (item of topNavbarItems; track item.title) {
          @if (item.style_variant === 'button_primary' || item.style_variant === 'button_primary,') {
            <a
              [href]="resolveNavUrl(item.URL, item.title)"
              [target]="item.open_newtab ? '_blank' : '_self'"
              class="bg-[#5a8a3c] hover:bg-[#4a7a2c] text-white text-sm font-semibold px-5 py-2 rounded-full transition duration-200"
            >
              {{ item.title }}
            </a>
          }
          @if (item.style_variant === 'button_secondary' || item.style_variant === 'button_secondary,') {
            <a
              [href]="resolveNavUrl(item.URL, item.title)"
              [target]="item.open_newtab ? '_blank' : '_self'"
              class="bg-[#8b2346] hover:bg-[#7b1336] text-white text-sm font-semibold px-5 py-2 rounded-full transition duration-200"
            >
              {{ item.title }}
            </a>
          }
          @if (item.style_variant === 'language_switcher') {
            <button
              class="flex items-center gap-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              {{ item.title }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          }
        }
      </div>
    </div>

    <!-- BOTTOM ROW: Navigation Links -->
    <div class="flex items-center justify-center gap-1 py-3 border-t border-gray-200">
      @for (item of bottomNavbarItems; track item.title) {
        <div
          class="relative group"
          (mouseenter)="openDropdown(item.title)"
          (mouseleave)="closeDropdown()"
        >
          <!-- Nav link -->
          <a
            [href]="resolveNavUrl(item.URL, item.title)"
            [target]="item.open_newtab ? '_blank' : '_self'"
            class="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition duration-200 whitespace-nowrap"
          >
            <!-- Optional icon (e.g. YODL logo) -->
            @if (item.icon) {
              <img
                [src]="getIconUrl(item.icon)"
                [alt]="item.title"
                class="h-5 w-5 object-contain"
              />
            }
            {{ item.title }}
            <!-- Dropdown arrow -->
            @if (item.has_dropdown && item.dropdown_items?.length) {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            }
          </a>

          <!-- Dropdown menu -->
          @if (item.has_dropdown && item.dropdown_items?.length && activeDropdown() === item.title) {
            <div
              class="absolute left-0 top-full mt-0 bg-white shadow-lg rounded-md py-2 min-w-[180px] z-50 border border-gray-100"
            >
              @for (dropdownItem of item.dropdown_items; track dropdownItem.Title) {
                <a
                  [href]="resolveNavUrl(dropdownItem.URL, dropdownItem.Title)"
                  [target]="dropdownItem.open_newtab ? '_blank' : '_self'"
                  class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition duration-200"
                >
                  {{ dropdownItem.Title }}
                </a>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DesktopNavbarComponent {
  @Input() topNavbarItems: any[] = [];
  @Input() bottomNavbarItems: any[] = [];
  @Input() logo: any;
  @Input() locale = 'en';
  @Input() showSearch = false;
  @Input() searchPlaceholder = 'Search...';

  activeDropdown = signal<string | null>(null);

  openDropdown(title: string) {
    this.activeDropdown.set(title);
  }

  closeDropdown() {
    this.activeDropdown.set(null);
  }

  getIconUrl(icon: any): string {
    return strapiImage(icon?.url);
  }

  resolveNavUrl(rawUrl: string | null | undefined, title: string | null | undefined): string {
    const url = (rawUrl || '').trim();

    if (this.isAuthCta(title)) {
      return `/${this.locale}/sign-up`;
    }

    if (!url || url === '#') {
      return '#';
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

