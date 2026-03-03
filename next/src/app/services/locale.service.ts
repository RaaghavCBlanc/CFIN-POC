import { Injectable, signal, computed } from '@angular/core';
import { i18n } from '../i18n.config';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private _locale = signal<string>(i18n.defaultLocale);

  readonly locale = this._locale.asReadonly();

  readonly currencySymbol = computed(() => {
    return this._locale() === 'fr' ? '€' : '$';
  });

  setLocale(locale: string) {
    if ((i18n.locales as readonly string[]).includes(locale)) {
      this._locale.set(locale);
    }
  }
}
