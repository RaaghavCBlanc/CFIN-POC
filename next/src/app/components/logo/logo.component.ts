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
        class="font-normal flex space-x-2 items-center text-sm mr-4 text-black relative z-20"
      >
        <app-blur-image
          [src]="getImageUrl()"
          [alt]="image.alternativeText || 'Logo'"
          className="h-10 w-10 rounded-xl object-contain"
        />
        <span class="text-white font-bold">LaunchPad</span>
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
