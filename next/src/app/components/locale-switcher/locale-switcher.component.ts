import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlugService } from '../../services/slug.service';
import { cn } from '../../utils/utils';
import { i18n } from '../../i18n.config';

@Component({
  selector: 'app-locale-switcher',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex gap-2 p-1 rounded-md">
      @for (loc of locales; track loc) {
        <a [routerLink]="generateLocalizedPath(loc)">
          <div [class]="getLocaleClass(loc)">
            {{ loc }}
          </div>
        </a>
      }
    </div>
  `,
})
export class LocaleSwitcherComponent {
  @Input() currentLocale = 'en';

  locales = i18n.locales;

  constructor(private slugService: SlugService) {}

  generateLocalizedPath(locale: string): string {
    const slugs = this.slugService.localizedSlugs();
    if (typeof window === 'undefined') return `/${locale}`;

    const pathname = window.location.pathname;
    if (!pathname) return `/${locale}`;

    const segments = pathname.split('/');
    if (segments.length <= 2) return `/${locale}`;

    if (slugs[locale]) {
      segments[1] = locale;
      segments[segments.length - 1] = slugs[locale];
      return segments.join('/');
    }

    segments[1] = locale;
    return segments.join('/');
  }

  getLocaleClass(locale: string): string {
    return cn(
      'flex cursor-pointer items-center justify-center text-sm leading-[110%] w-8 py-1 rounded-md hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200',
      locale === this.currentLocale
        ? 'bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--neutral-600)_inset]'
        : ''
    );
  }
}
