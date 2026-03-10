import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  inject,
} from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { ContainerComponent } from '../container/container.component';
import { StrapiImageComponent } from '../ui/strapi-image.component';

@Component({
  selector: 'app-home-community-carousel',
  standalone: true,
  imports: [ContainerComponent, StrapiImageComponent, NgTemplateOutlet],
  template: `
    <section class="bg-[#f3f4f6] py-14 md:py-20">
      <app-container>
        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-3xl md:text-5xl font-bold text-[#152744]">{{ heading }}</h2>
          @if (sub_heading) {
            <p class="mt-4 text-sm md:text-base leading-relaxed text-[#486079]">{{ sub_heading }}</p>
          }
        </div>

        @if (visibleCards.length) {
          <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            @for (card of visibleCards; track card.id || $index) {
              @if (card.link_url) {
                <a
                  [href]="getCardHref(card.link_url)"
                  [attr.target]="card.open_in_newtab ? '_blank' : '_self'"
                  rel="noopener noreferrer"
                  class="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <ng-container [ngTemplateOutlet]="cardContent" [ngTemplateOutletContext]="{ card: card }" />
                </a>
              } @else {
                <article class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <ng-container [ngTemplateOutlet]="cardContent" [ngTemplateOutletContext]="{ card: card }" />
                </article>
              }
            }
          </div>

          <ng-template #cardContent let-card="card">
            <h3 class="text-[30px] font-bold leading-snug text-[#152744]">{{ card.title }}</h3>

            <div class="mt-4 flex items-center gap-3">
              <div class="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
                <app-strapi-image
                  [src]="card.author_avatar?.url"
                  [alt]="card.author_avatar?.alternativeText || card.author_name || 'Avatar'"
                  className="h-full w-full object-cover"
                  [width]="36"
                  [height]="36"
                />
              </div>
              <div>
                <p class="text-sm font-semibold text-[#152744]">{{ card.author_name }}</p>
                @if (card.author_role) {
                  <p class="text-xs text-gray-500">{{ card.author_role }}</p>
                }
              </div>
            </div>

            <p class="mt-4 line-clamp-4 text-sm leading-7 text-[#3d556e]">{{ card.excerpt }}</p>

            @if (card.chip_label) {
              <div class="mt-5">
                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  [style.background-color]="getChipBackground(card.chip_color)"
                  [style.color]="getChipTextColor(card.chip_color)"
                >
                  {{ card.chip_label }}
                </span>
              </div>
            }
          </ng-template>

          @if (totalPages > 1 && show_dots) {
            <div class="mt-6 flex items-center justify-center gap-2">
              @for (dot of pageIndexes; track dot) {
                <button
                  type="button"
                  (click)="goToPage(dot)"
                  [class]="dot === currentPage ? 'h-2.5 w-7 rounded-full bg-[#8c6276]' : 'h-2.5 w-2.5 rounded-full bg-gray-300'"
                  [attr.aria-label]="'Go to page ' + (dot + 1)"
                ></button>
              }
            </div>
          }

          @if (totalPages > 1 && show_arrows) {
            <div class="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                (click)="prevPage()"
                class="h-10 w-10 rounded-full bg-[#8c6276] text-white"
                aria-label="Previous cards"
              >
                &#8249;
              </button>
              <button
                type="button"
                (click)="nextPage()"
                class="h-10 w-10 rounded-full bg-[#8c6276] text-white"
                aria-label="Next cards"
              >
                &#8250;
              </button>
            </div>
          }
        }
      </app-container>
    </section>
  `,
})
export class HomeCommunityCarouselComponent implements OnInit, OnChanges, OnDestroy {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() cards: any[] = [];
  @Input() show_arrows = true;
  @Input() show_dots = true;
  @Input() autoplay = false;
  @Input() autoplay_interval_ms = 6000;
  @Input() locale = 'en';

  currentPage = 0;
  cardsPerPage = 3;

  private readonly platformId = inject(PLATFORM_ID);
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  get totalPages(): number {
    const count = this.cards?.length || 0;
    if (!count) {
      return 0;
    }

    return Math.ceil(count / this.cardsPerPage);
  }

  get pageIndexes(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  get visibleCards(): any[] {
    if (!this.cards?.length) {
      return [];
    }

    const start = this.currentPage * this.cardsPerPage;
    return this.cards.slice(start, start + this.cardsPerPage);
  }

  ngOnInit(): void {
    this.updateCardsPerPage();
    this.restartAutoplay();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.currentPage = Math.min(this.currentPage, Math.max(this.totalPages - 1, 0));
    this.restartAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateCardsPerPage();
    this.currentPage = Math.min(this.currentPage, Math.max(this.totalPages - 1, 0));
  }

  prevPage(): void {
    if (this.totalPages <= 1) {
      return;
    }

    this.currentPage = this.currentPage === 0 ? this.totalPages - 1 : this.currentPage - 1;
  }

  nextPage(): void {
    if (this.totalPages <= 1) {
      return;
    }

    this.currentPage = (this.currentPage + 1) % this.totalPages;
  }

  goToPage(index: number): void {
    this.currentPage = index;
  }

  getCardHref(url: string): string {
    const normalized = (url || '').trim();
    if (!normalized) {
      return '#';
    }

    if (this.isExternalUrl(normalized)) {
      return normalized;
    }

    if (normalized.startsWith(`/${this.locale}/`) || normalized === `/${this.locale}`) {
      return normalized;
    }

    if (normalized === '/') {
      return `/${this.locale}`;
    }

    if (normalized.startsWith('/')) {
      return `/${this.locale}${normalized}`;
    }

    return `/${this.locale}/${normalized}`;
  }

  getChipBackground(color: string | null | undefined): string {
    return color || '#e5e7eb';
  }

  getChipTextColor(color: string | null | undefined): string {
    if (!color) {
      return '#374151';
    }

    return this.isColorDark(color) ? '#ffffff' : '#1f2937';
  }

  private restartAutoplay(): void {
    this.stopAutoplay();

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.autoplay || this.totalPages <= 1) {
      return;
    }

    const interval = this.autoplay_interval_ms && this.autoplay_interval_ms > 0
      ? this.autoplay_interval_ms
      : 6000;

    this.autoplayTimer = setInterval(() => {
      this.nextPage();
    }, interval);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private updateCardsPerPage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.cardsPerPage = 3;
      return;
    }

    const width = window.innerWidth;
    if (width < 768) {
      this.cardsPerPage = 1;
      return;
    }

    if (width < 1280) {
      this.cardsPerPage = 2;
      return;
    }

    this.cardsPerPage = 3;
  }

  private isColorDark(color: string): boolean {
    const hex = color.replace('#', '').trim();
    if (hex.length !== 6) {
      return false;
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    if ([r, g, b].some(value => Number.isNaN(value))) {
      return false;
    }

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance < 0.55;
  }

  private isExternalUrl(url: string): boolean {
    return /^(https?:|mailto:|tel:)/i.test(url);
  }
}
