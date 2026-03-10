import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ContainerComponent } from '../container/container.component';
import { StrapiImageComponent } from '../ui/strapi-image.component';

@Component({
  selector: 'app-home-trusted-members',
  standalone: true,
  imports: [ContainerComponent, StrapiImageComponent],
  template: `
    <section class="bg-white py-16 md:py-24">
      <app-container>
        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-3xl md:text-5xl font-bold text-[#152744]">
            {{ heading_prefix }}
            <span class="text-[#8c6276]"> {{ highlight_number }} </span>
            {{ heading_suffix }}
          </h2>
          @if (sub_heading) {
            <p class="mt-4 text-sm md:text-base leading-relaxed text-[#486079]">{{ sub_heading }}</p>
          }
        </div>

        @if (logos?.length) {
          <div class="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
            @for (logo of logos; track logo.id || $index) {
              <div class="opacity-85">
                <app-strapi-image
                  [src]="logo.image?.url"
                  [alt]="logo.image?.alternativeText || logo.company || 'Partner logo'"
                  className="h-8 w-auto object-contain md:h-10"
                  [width]="180"
                  [height]="56"
                />
              </div>
            }
          </div>
        }

        @if (visibleTestimonials.length) {
          <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            @for (testimonial of visibleTestimonials; track testimonial.id || $index) {
              <article class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                      <app-strapi-image
                        [src]="testimonial.user?.image?.url"
                        [alt]="fullName(testimonial)"
                        className="h-full w-full object-cover"
                        [width]="40"
                        [height]="40"
                      />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-[#152744]">{{ fullName(testimonial) }}</p>
                      <p class="text-xs text-gray-500">{{ testimonial.user?.job }}</p>
                    </div>
                  </div>
                </div>

                <p class="mt-4 text-sm leading-7 text-[#3d556e]">"{{ testimonial.text }}"</p>
              </article>
            }
          </div>

          @if (totalPages > 1 && show_dots) {
            <div class="mt-6 flex items-center justify-center gap-2">
              @for (dot of pageIndexes; track dot) {
                <button
                  type="button"
                  (click)="goToPage(dot)"
                  [class]="dot === currentPage ? 'h-2.5 w-7 rounded-full bg-[#8c6276]' : 'h-2.5 w-2.5 rounded-full bg-gray-300'"
                  [attr.aria-label]="'Go to testimonial page ' + (dot + 1)"
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
                aria-label="Previous testimonials"
              >
                &#8249;
              </button>
              <button
                type="button"
                (click)="nextPage()"
                class="h-10 w-10 rounded-full bg-[#8c6276] text-white"
                aria-label="Next testimonials"
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
export class HomeTrustedMembersComponent implements OnInit, OnChanges {
  @Input() heading_prefix = 'Trusted by';
  @Input() highlight_number = '8,000';
  @Input() heading_suffix = 'Happy Members';
  @Input() sub_heading = '';
  @Input() logos: any[] = [];
  @Input() testimonials: any[] = [];
  @Input() show_arrows = true;
  @Input() show_dots = true;
  @Input() locale = 'en';

  currentPage = 0;
  testimonialsPerPage = 3;

  private readonly platformId = inject(PLATFORM_ID);

  get totalPages(): number {
    const count = this.testimonials?.length || 0;
    if (!count) {
      return 0;
    }

    return Math.ceil(count / this.testimonialsPerPage);
  }

  get pageIndexes(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  get visibleTestimonials(): any[] {
    if (!this.testimonials?.length) {
      return [];
    }

    const start = this.currentPage * this.testimonialsPerPage;
    return this.testimonials.slice(start, start + this.testimonialsPerPage);
  }

  ngOnInit(): void {
    this.updateTestimonialsPerPage();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.currentPage = Math.min(this.currentPage, Math.max(this.totalPages - 1, 0));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateTestimonialsPerPage();
    this.currentPage = Math.min(this.currentPage, Math.max(this.totalPages - 1, 0));
  }

  fullName(testimonial: any): string {
    const first = testimonial?.user?.firstname || '';
    const last = testimonial?.user?.lastname || '';
    const name = `${first} ${last}`.trim();
    return name || 'Member';
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

  private updateTestimonialsPerPage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.testimonialsPerPage = 3;
      return;
    }

    const width = window.innerWidth;
    if (width < 768) {
      this.testimonialsPerPage = 1;
      return;
    }

    if (width < 1280) {
      this.testimonialsPerPage = 2;
      return;
    }

    this.testimonialsPerPage = 3;
  }
}
