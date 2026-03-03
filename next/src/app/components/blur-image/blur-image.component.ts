import { Component, Input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-blur-image',
  standalone: true,
  imports: [NgClass],
  template: `
    <img
      [src]="src"
      [alt]="alt || 'Avatar'"
      [class]="computedClass()"
      [attr.width]="width || null"
      [attr.height]="height || null"
      loading="lazy"
      decoding="async"
      (load)="onLoad()"
    />
  `,
  styles: [`:host { display: contents; }`],
})
export class BlurImageComponent {
  @Input() src = '';
  @Input() alt?: string;
  @Input() className?: string;
  @Input() width?: number;
  @Input() height?: number;

  isLoading = signal(true);

  computedClass() {
    return cn(
      'transition duration-300',
      this.isLoading() ? 'blur-sm' : 'blur-0',
      this.className
    );
  }

  onLoad() {
    this.isLoading.set(false);
  }
}
