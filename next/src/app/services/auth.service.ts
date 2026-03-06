import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getApiUrl } from '../utils/utils';

interface StrapiAuthError {
  error?: {
    message?: string;
  };
}

export interface AuthUser {
  id: number;
  username?: string;
  email?: string;
  role?: {
    id: number;
    name: string;
    type: string;
  };
}

interface LoginResponse {
  jwt: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenStorageKey = 'cfin_auth_jwt';
  private readonly userStorageKey = 'cfin_auth_user';

  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _bootstrapped = signal(false);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  constructor() {
    this.restoreFromStorage();
  }

  getToken(): string | null {
    return this._token();
  }

  async bootstrapSession(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || this._bootstrapped()) {
      return;
    }

    this._bootstrapped.set(true);

    if (!this._token()) {
      return;
    }

    try {
      const user = await this.fetchMe();
      this._user.set(user);
      this.persistUser(user);
    } catch {
      this.logout();
    }
  }

  async login(identifier: string, password: string): Promise<AuthUser> {
    const response = await fetch(`${getApiUrl()}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const payload = await this.parseJson<LoginResponse | StrapiAuthError>(response);
    if (!response.ok || !payload || !('jwt' in payload)) {
      const errorMessage = this.extractErrorMessage(payload) || 'Login failed';
      throw new Error(errorMessage);
    }

    this.persistSession(payload.jwt, payload.user);

    try {
      const user = await this.fetchMe();
      this._user.set(user);
      this.persistUser(user);
      return user;
    } catch {
      return payload.user;
    }
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userStorageKey);
  }

  async fetchMe(): Promise<AuthUser> {
    const jwt = this._token();
    if (!jwt) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${getApiUrl()}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const payload = await this.parseJson<AuthUser | StrapiAuthError>(response);
    if (!response.ok || !payload || ('error' in payload && payload.error)) {
      const errorMessage = this.extractErrorMessage(payload) || 'Failed to fetch user profile';
      throw new Error(errorMessage);
    }

    return payload as AuthUser;
  }

  private restoreFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem(this.tokenStorageKey);
    if (token) {
      this._token.set(token);
    }

    const userRaw = localStorage.getItem(this.userStorageKey);
    if (!userRaw) {
      return;
    }

    try {
      const user = JSON.parse(userRaw) as AuthUser;
      this._user.set(user);
    } catch {
      localStorage.removeItem(this.userStorageKey);
    }
  }

  private persistSession(jwt: string, user: AuthUser): void {
    this._token.set(jwt);
    this._user.set(user);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.tokenStorageKey, jwt);
    this.persistUser(user);
  }

  private persistUser(user: AuthUser): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
  }

  private async parseJson<T>(response: Response): Promise<T | null> {
    try {
      return (await response.json()) as T;
    } catch {
      return null;
    }
  }

  private extractErrorMessage(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const candidate = payload as StrapiAuthError;
    const message = candidate.error?.message;
    return typeof message === 'string' && message.trim() ? message : null;
  }
}
