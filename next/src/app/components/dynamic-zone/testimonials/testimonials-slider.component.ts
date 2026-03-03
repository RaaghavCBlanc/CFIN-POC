import { Component, Input, signal, OnInit, OnDestroy, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { StrapiImageComponent } from '../../ui/strapi-image.component';
import { cn } from '../../../utils/utils';

@Component({
  selector: 'app-testimonials-slider',
  standalone: true,
  imports: [StrapiImageComponent],
  styles: [`
    .slide-enter {
      animation: slideIn 0.7s cubic-bezier(0.68, -0.3, 0.32, 1) forwards;
    }
    .slide-exit {
      animation: slideOut 0.7s cubic-bezier(0.68, -0.3, 0.32, 1) forwards;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(20px); }
    }
    .text-enter {
      animation: textIn 0.5s ease-in-out 0.2s both;
    }
    @keyframes textIn {
      from { opacity: 0; transform: translateX(-4px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `],
  template: `
    <section>
      <div class="max-w-3xl mx-auto relative z-30 h-80">
        <div class="relative pb-12 md:pb-20">
          <!-- Sparkles placeholder (3D skipped) -->
          <div class="absolute left-1/2 -translate-x-1/2 -top-2 -z-10 w-80 h-20 -mt-6">
            <div class="w-full h-full bg-gradient-to-b from-white/5 to-transparent rounded-full"></div>
          </div>

          <div class="text-center">
            <!-- Testimonial image -->
            <div class="relative h-40 [mask-image:_linear-gradient(0deg,transparent,#FFFFFF_30%,#FFFFFF)] md:[mask-image:_linear-gradient(0deg,transparent,#FFFFFF_40%,#FFFFFF)]">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] -z-10 pointer-events-none before:rounded-full rounded-full before:absolute before:inset-0 before:bg-gradient-to-b before:from-neutral-400/20 before:to-transparent before:to-20% after:rounded-full after:absolute after:inset-0 after:bg-neutral-900 after:m-px before:-z-20 after:-z-20">
                @for (item of slicedTestimonials; track $index) {
                  @if (active() === $index) {
                    <div class="absolute inset-0 h-full -z-10 slide-enter">
                      <app-strapi-image
                        class="relative top-11 left-1/2 -translate-x-1/2 rounded-full"
                        [src]="item.user?.image?.url"
                        [width]="56"
                        [height]="56"
                        [alt]="item.user?.firstname + ' ' + item.user?.lastname"
                      />
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Text -->
            <div class="mb-10 transition-all duration-150 delay-300 ease-in-out px-8 sm:px-6">
              <div class="relative flex flex-col" #testimonialsRef>
                @for (item of slicedTestimonials; track $index) {
                  @if (active() === $index) {
                    <div class="text-base md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200/60 via-neutral-200 to-neutral-200/60 text-enter">
                      {{ item.text }}
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-wrap justify-center -m-1.5 px-8 sm:px-6">
              @for (item of slicedTestimonials; track $index) {
                <button
                  [class]="getButtonClass($index)"
                  (click)="setActiveManual($index)"
                >
                  <span class="relative">
                    <span class="text-neutral-50 font-bold">{{ item.user?.firstname }}{{ item.user?.lastname }}</span>
                    <br class="block sm:hidden" />
                    <span class="text-neutral-600 hidden sm:inline-block"> - </span>
                    <span class="hidden sm:inline-block">{{ item.user?.job }}</span>
                  </span>
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsSliderComponent implements OnInit, OnDestroy {
  @Input() testimonials: any[] = [];

  active = signal(0);
  autorotate = signal(true);
  slicedTestimonials: any[] = [];

  private intervalId: any;

  ngOnInit(): void {
    this.slicedTestimonials = (this.testimonials || []).slice(0, 3);
    this.startAutorotate();
  }

  ngOnDestroy(): void {
    this.stopAutorotate();
  }

  private startAutorotate(): void {
    this.intervalId = setInterval(() => {
      if (!this.autorotate()) return;
      const next = this.active() + 1 === this.slicedTestimonials.length ? 0 : this.active() + 1;
      this.active.set(next);
    }, 7000);
  }

  private stopAutorotate(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  setActiveManual(index: number): void {
    this.active.set(index);
    this.autorotate.set(false);
    this.stopAutorotate();
  }

  getButtonClass(index: number): string {
    const isActive = this.active() === index;
    return cn(
      'px-2 py-1 rounded-full m-1.5 text-xs border text-neutral-300 transition duration-150 ease-in-out',
      '[background:linear-gradient(theme(colors.neutral.900),_theme(colors.neutral.900))_padding-box,_conic-gradient(theme(colors.neutral.400),_theme(colors.neutral.700)_25%,_theme(colors.neutral.700)_75%,_theme(colors.neutral.400)_100%)_border-box]',
      'relative before:absolute before:inset-0 before:bg-neutral-800/30 before:rounded-full before:pointer-events-none',
      isActive ? 'border-secondary/50' : 'border-transparent opacity-70'
    );
  }
}
