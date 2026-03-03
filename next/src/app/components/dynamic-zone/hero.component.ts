import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoverComponent } from '../decorations/cover.component';
import { ShootingStarsComponent } from '../decorations/shooting-stars.component';
import { StarBackgroundComponent } from '../decorations/star-background.component';
import { ButtonComponent } from '../elements/button.component';
import { HeadingComponent } from '../elements/heading.component';
import { SubheadingComponent } from '../elements/subheading.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    RouterLink,
    StarBackgroundComponent,
    ShootingStarsComponent,
    ButtonComponent,
    HeadingComponent,
    SubheadingComponent,
  ],
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .hero-fade-in {
      animation: fadeIn 0.5s ease-out 0.5s both;
    }
  `],
  template: `
    <div class="min-h-[calc(100vh-4rem)] overflow-hidden relative flex flex-col items-center justify-center">
      <div class="hero-fade-in">
        <app-star-background />
        <app-shooting-stars />
      </div>
      <app-heading
        as="h1"
        className="text-4xl md:text-4xl lg:text-8xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-10 py-6"
      >
        {{ heading }}
      </app-heading>
      <app-subheading className="text-center mt-2 md:mt-6 text-base md:text-xl text-muted max-w-3xl mx-auto relative z-10">
        {{ sub_heading }}
      </app-subheading>
      <div class="flex space-x-2 items-center mt-8">
        @if (CTAs) {
          @for (cta of CTAs; track cta.id) {
            <app-button
              [routerLink]="'/' + locale + cta.URL"
              [variant]="cta.variant || 'primary'"
            >
              {{ cta.text }}
            </app-button>
          }
        }
      </div>
      <div class="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-charcoal to-transparent"></div>
    </div>
  `,
})
export class HeroComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() CTAs: any[] = [];
  @Input() locale = 'en';
}
