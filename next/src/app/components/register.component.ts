import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { ButtonComponent } from './elements/button.component';
import { LogoComponent } from './logo/logo.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ContainerComponent, ButtonComponent, LogoComponent],
  template: `
    <app-container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
      <app-logo [locale]="locale" />
      <h1 class="text-xl md:text-4xl font-bold my-4">Sign in to LaunchPad</h1>

      <form class="w-full my-4" (ngSubmit)="onLogin()">
        <input
          type="email"
          name="identifier"
          [(ngModel)]="identifier"
          placeholder="Email Address"
          autocomplete="username"
          required
          class="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <input
          type="password"
          name="password"
          [(ngModel)]="password"
          placeholder="Password"
          autocomplete="current-password"
          required
          class="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <app-button variant="muted" type="submit" className="w-full py-3" [disabled]="isSubmitting || !identifier || !password">
          <span class="text-sm">{{ isSubmitting ? 'Signing in...' : 'Sign in' }}</span>
        </app-button>
      </form>

      @if (errorMessage) {
        <p class="w-full text-sm text-red-400 text-left">{{ errorMessage }}</p>
      }

      <p class="w-full text-xs text-neutral-500 mt-4 text-left">
        Accounts are created by administrators in the Strapi portal.
      </p>
    </app-container>
  `,
  styles: [`:host { display: block; }`],
})
export class RegisterComponent {
  identifier = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  get locale(): string {
    return this.route.parent?.snapshot.paramMap.get('locale') || 'en';
  }

  async onLogin(): Promise<void> {
    if (!this.identifier || !this.password || this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    try {
      await this.authService.login(this.identifier, this.password);
      const locale = this.locale;
      const redirect = this.route.snapshot.queryParamMap.get('redirect');

      if (redirect && redirect.startsWith('/')) {
        await this.router.navigateByUrl(redirect);
      } else {
        await this.router.navigateByUrl(`/${locale}/blog`);
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Login failed';
    } finally {
      this.isSubmitting = false;
    }
  }
}
