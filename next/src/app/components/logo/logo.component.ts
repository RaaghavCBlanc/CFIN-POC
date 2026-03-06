import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlurImageComponent } from '../blur-image/blur-image.component';
import { strapiImage } from '../../utils/utils';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink, BlurImageComponent],
  template: `
    @if (image) {
      <a
        [routerLink]="'/' + (locale || 'en')"
        class="flex items-center relative z-20 mr-4"
      >
        <app-blur-image
          [src]="getImageUrl()"
          [alt]="image.alternativeText || 'CFIN Logo'"
          className="h-16 w-auto object-contain"
        />
      </a>
    }
  `,
})
export class LogoComponent {
  @Input() image: any;
  @Input() locale?: string;

  getImageUrl(): string {
    return strapiImage(this.image?.url);
  }
}
