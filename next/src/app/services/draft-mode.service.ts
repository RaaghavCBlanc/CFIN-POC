import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DraftModeService {
  private _isDraftMode = signal(false);
  readonly isDraftMode = this._isDraftMode.asReadonly();

  enable() {
    this._isDraftMode.set(true);
    this.setCookie('__draft_mode', 'true');
  }

  disable() {
    this._isDraftMode.set(false);
    this.deleteCookie('__draft_mode');
  }

  checkFromCookie() {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const draftCookie = cookies.find(c => c.trim().startsWith('__draft_mode='));
      if (draftCookie) {
        this._isDraftMode.set(true);
      }
    }
  }

  private setCookie(name: string, value: string) {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
    }
  }

  private deleteCookie(name: string) {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
}
