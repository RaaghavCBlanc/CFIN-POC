import { Component, Input, Output, EventEmitter } from '@angular/core';
import { getStrapiMedia } from '../../utils/utils';

@Component({
  selector: 'app-strapi-image',
  standalone: true,
  template: `
    @if (imageUrl) {
      <img
        [src]="imageUrl"
        [alt]="alt || 'No alternative text provided'"
        [class]="className || ''"
        [width]="width"
        [height]="height"
        loading="lazy"
        decoding="async"
        (mousemove)="mouseMove.emit($event)"
      />
    }
  `,
  styles: [`:host { display: contents; }`],
})
export class StrapiImageComponent {
  @Input() src = '';
  @Input() alt?: string | null;
  @Input() className?: string;
  @Input() width?: number;
  @Input() height?: number;
  @Input() draggable?: boolean;

  @Output() mouseMove = new EventEmitter<MouseEvent>();

  get imageUrl(): string | null {
    return getStrapiMedia(this.src);
  }
}
