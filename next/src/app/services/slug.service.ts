import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SlugService {
  private _localizedSlugs = signal<Record<string, string>>({});

  readonly localizedSlugs = this._localizedSlugs.asReadonly();

  setLocalizedSlugs(slugs: Record<string, string>) {
    this._localizedSlugs.set(slugs);
  }
}
