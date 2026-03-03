import { Component, signal, OnInit } from '@angular/core';
import { ExternalLinkIconComponent } from '../icons/external-link.component';
import { XIconComponent } from '../icons/x-icon.component';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [ExternalLinkIconComponent, XIconComponent],
  template: `
    <div [class]="toastClass()">
      <div class="flex items-start">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">Strapi AI</p>
          <p class="mt-1 text-sm text-gray-500">
            You can now try Strapi AI for yourself!
          </p>
          <div class="mt-3">
            <a
              href="https://docs.strapi.io/cms/configurations/admin-panel#strapi-ai"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Go to docs
              <app-external-link-icon class="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <button
            type="button"
            (click)="isOpen.set(false)"
            class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <span class="sr-only">Close</span>
            <app-x-icon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ToastComponent implements OnInit {
  isOpen = signal(false);

  toastClass() {
    return cn(
      'fixed bottom-4 left-4 z-50 bg-secondary text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 opacity-0 transition-all',
      this.isOpen() && 'opacity-100'
    );
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      setTimeout(() => this.isOpen.set(true), 2000);
    }
  }
}
