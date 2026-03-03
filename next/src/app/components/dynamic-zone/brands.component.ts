import { Component, Input, signal, OnInit, OnDestroy } from '@angular/core';
import { HeadingComponent } from '../elements/heading.component';
import { SubheadingComponent } from '../elements/subheading.component';
import { StrapiImageComponent } from '../ui/strapi-image.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [HeadingComponent, SubheadingComponent, StrapiImageComponent],
  styles: [`
    @keyframes brandIn {
      from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
      to { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes brandOut {
      from { opacity: 1; transform: translateY(0); filter: blur(0); }
      to { opacity: 0; transform: translateY(-40px); filter: blur(10px); }
    }
    .brand-enter {
      animation: brandIn 0.8s ease forwards;
    }
  `],
  template: `
    <div class="relative z-20 py-10 md:py-40">
      <app-heading className="pt-4">{{ heading }}</app-heading>
      <app-subheading className="max-w-3xl mx-auto">{{ sub_heading }}</app-subheading>

      <div class="flex gap-10 flex-wrap justify-center md:gap-40 relative h-full w-full mt-20">
        @for (logo of activeLogoSet(); track logo.title || $index) {
          <div class="relative brand-enter" [style.animation-delay]="($index * 100) + 'ms'">
            <app-strapi-image
              [src]="logo.image?.url"
              [alt]="logo.image?.alternativeText || logo.title"
              [width]="400"
              [height]="400"
              className="md:h-20 md:w-60 h-10 w-40 object-contain filter"
            />
          </div>
        }
      </div>
    </div>
  `,
})
export class BrandsComponent implements OnInit, OnDestroy {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() logos: any[] = [];

  activeLogoSet = signal<any[]>([]);
  private logoSets: any[][] = [];
  private currentSetIndex = 0;
  private timeoutId: any;

  ngOnInit(): void {
    if (!this.logos?.length) return;
    const middleIndex = Math.floor(this.logos.length / 2);
    this.logoSets = [
      this.logos.slice(0, middleIndex),
      this.logos.slice(middleIndex),
    ];
    this.activeLogoSet.set(this.logoSets[0]);
    this.scheduleFlip();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  private scheduleFlip(): void {
    this.timeoutId = setTimeout(() => {
      this.currentSetIndex = (this.currentSetIndex + 1) % this.logoSets.length;
      this.activeLogoSet.set(this.logoSets[this.currentSetIndex]);
      this.scheduleFlip();
    }, 3000);
  }
}
