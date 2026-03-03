import { Component, Input } from '@angular/core';
import { StrapiImageComponent } from '../../ui/strapi-image.component';
import { cn } from '../../../utils/utils';

@Component({
  selector: 'app-testimonials-marquee',
  standalone: true,
  imports: [StrapiImageComponent],
  styles: [`
    @keyframes marquee-left {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes marquee-right {
      from { transform: translateX(-50%); }
      to { transform: translateX(0); }
    }
    .marquee-track-left {
      display: flex;
      width: max-content;
      animation: marquee-left 40s linear infinite;
    }
    .marquee-track-right {
      display: flex;
      width: max-content;
      animation: marquee-right 60s linear infinite;
    }
  `],
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Row 1 -->
      <div class="flex h-full relative overflow-hidden">
        <div class="h-full absolute w-20 left-0 inset-y-0 z-30 bg-gradient-to-r from-charcoal to-transparent"></div>
        <div class="h-full absolute w-20 right-0 inset-y-0 z-30 bg-gradient-to-l from-charcoal to-transparent"></div>
        <div class="marquee-track-left">
          @for (testimonial of levelOne; track testimonial.id + '-' + $index) {
            <div [class]="cardClass">
              <h3 class="text-base font-semibold text-white py-2">{{ testimonial?.text }}</h3>
              <div class="flex gap-2 items-center mt-8">
                <app-strapi-image
                  [src]="testimonial?.user?.image?.url"
                  [alt]="testimonial?.user?.firstname + ' ' + testimonial?.user?.lastname"
                  [width]="40"
                  [height]="40"
                  className="rounded-full"
                />
                <div class="flex flex-col">
                  <p class="text-sm font-normal text-neutral-300 max-w-sm">{{ testimonial?.user?.firstname }} {{ testimonial?.user?.lastname }}</p>
                  <p class="text-sm font-normal text-neutral-400 max-w-sm">{{ testimonial?.user?.job }}</p>
                </div>
              </div>
            </div>
          }
          <!-- Duplicate for seamless loop -->
          @for (testimonial of levelOne; track testimonial.id + '-dup-' + $index) {
            <div [class]="cardClass">
              <h3 class="text-base font-semibold text-white py-2">{{ testimonial?.text }}</h3>
              <div class="flex gap-2 items-center mt-8">
                <app-strapi-image
                  [src]="testimonial?.user?.image?.url"
                  [alt]="testimonial?.user?.firstname + ' ' + testimonial?.user?.lastname"
                  [width]="40"
                  [height]="40"
                  className="rounded-full"
                />
                <div class="flex flex-col">
                  <p class="text-sm font-normal text-neutral-300 max-w-sm">{{ testimonial?.user?.firstname }} {{ testimonial?.user?.lastname }}</p>
                  <p class="text-sm font-normal text-neutral-400 max-w-sm">{{ testimonial?.user?.job }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Row 2 -->
      <div class="flex h-full relative mt-8 overflow-hidden">
        <div class="h-full absolute w-20 left-0 inset-y-0 z-30 bg-gradient-to-r from-charcoal to-transparent"></div>
        <div class="h-full absolute w-20 right-0 inset-y-0 z-30 bg-gradient-to-l from-charcoal to-transparent"></div>
        <div class="marquee-track-right">
          @for (testimonial of levelTwo; track testimonial.id + '-' + $index) {
            <div [class]="cardClass">
              <h3 class="text-base font-semibold text-white py-2">{{ testimonial?.text }}</h3>
              <div class="flex gap-2 items-center mt-8">
                <app-strapi-image
                  [src]="testimonial?.user?.image?.url"
                  [alt]="testimonial?.user?.firstname + ' ' + testimonial?.user?.lastname"
                  [width]="40"
                  [height]="40"
                  className="rounded-full"
                />
                <div class="flex flex-col">
                  <p class="text-sm font-normal text-neutral-300 max-w-sm">{{ testimonial?.user?.firstname }} {{ testimonial?.user?.lastname }}</p>
                  <p class="text-sm font-normal text-neutral-400 max-w-sm">{{ testimonial?.user?.job }}</p>
                </div>
              </div>
            </div>
          }
          <!-- Duplicate for seamless loop -->
          @for (testimonial of levelTwo; track testimonial.id + '-dup-' + $index) {
            <div [class]="cardClass">
              <h3 class="text-base font-semibold text-white py-2">{{ testimonial?.text }}</h3>
              <div class="flex gap-2 items-center mt-8">
                <app-strapi-image
                  [src]="testimonial?.user?.image?.url"
                  [alt]="testimonial?.user?.firstname + ' ' + testimonial?.user?.lastname"
                  [width]="40"
                  [height]="40"
                  className="rounded-full"
                />
                <div class="flex flex-col">
                  <p class="text-sm font-normal text-neutral-300 max-w-sm">{{ testimonial?.user?.firstname }} {{ testimonial?.user?.lastname }}</p>
                  <p class="text-sm font-normal text-neutral-400 max-w-sm">{{ testimonial?.user?.job }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class TestimonialsMarqueeComponent {
  @Input() testimonials: any[] = [];

  cardClass = cn(
    'p-8 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group',
    'max-w-xl h-60 mx-4 flex-shrink-0'
  );

  get levelOne(): any[] {
    return (this.testimonials || []).slice(0, 8);
  }

  get levelTwo(): any[] {
    return (this.testimonials || []).slice(8, 16);
  }
}
