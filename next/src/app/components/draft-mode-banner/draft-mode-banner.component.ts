import { Component, signal, OnInit } from '@angular/core';
import { DraftModeService } from '../../services/draft-mode.service';

@Component({
  selector: 'app-draft-mode-banner',
  standalone: true,
  template: `
    @if (!isIframe()) {
      <div class="fixed bottom-4 right-4 z-50 bg-secondary text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="inline-block w-4 h-4 bg-black rounded-full animate-pulse"></span>
          <span class="font-semibold">Draft Mode</span>
        </div>
        <button
          (click)="handleExitDraft()"
          [disabled]="isExiting()"
          class="bg-black text-white px-4 py-1 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {{ isExiting() ? 'Exiting...' : 'Exit Draft' }}
        </button>
      </div>
    }
  `,
})
export class DraftModeBannerComponent implements OnInit {
  isExiting = signal(false);
  isIframe = signal(true);

  constructor(private draftModeService: DraftModeService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isIframe.set(window !== window.top);
    }
  }

  async handleExitDraft() {
    this.isExiting.set(true);
    try {
      await fetch('/api/exit-preview');
      this.draftModeService.disable();
      window.location.reload();
    } catch (error) {
      console.error('Failed to exit draft mode:', error);
      this.isExiting.set(false);
    }
  }
}
