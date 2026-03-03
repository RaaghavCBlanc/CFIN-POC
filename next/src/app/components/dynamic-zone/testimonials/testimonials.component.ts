import { Component, Input } from '@angular/core';
import { AmbientColorComponent } from '../../decorations/ambient-color.component';
import { HeadingComponent } from '../../elements/heading.component';
import { SubheadingComponent } from '../../elements/subheading.component';
import { FeatureIconContainerComponent } from '../features/feature-icon-container.component';
import { TestimonialsSliderComponent } from './testimonials-slider.component';
import { TestimonialsMarqueeComponent } from './testimonials-marquee.component';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [
    AmbientColorComponent,
    HeadingComponent,
    SubheadingComponent,
    FeatureIconContainerComponent,
    TestimonialsSliderComponent,
    TestimonialsMarqueeComponent,
  ],
  template: `
    <div class="relative">
      <app-ambient-color />
      <div class="pb-20">
        <app-feature-icon-container className="flex justify-center items-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="m15 9-6 6"/>
            <path d="M9 9h.01"/>
            <path d="M15 15h.01"/>
          </svg>
        </app-feature-icon-container>
        <app-heading className="pt-4">{{ heading }}</app-heading>
        <app-subheading>{{ sub_heading }}</app-subheading>
      </div>

      @if (testimonials) {
        <div class="relative md:py-20 pb-20">
          <app-testimonials-slider [testimonials]="testimonialsList" />
          <div class="h-full w-full mt-20 bg-charcoal">
            <app-testimonials-marquee [testimonials]="testimonialsList" />
          </div>
        </div>
      }

      <div class="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-charcoal to-transparent"></div>
    </div>
  `,
})
export class TestimonialsComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() testimonials: any;

  get testimonialsList(): any[] {
    return Array.isArray(this.testimonials) ? this.testimonials : [];
  }
}
