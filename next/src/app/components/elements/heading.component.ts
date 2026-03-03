import { Component, Input } from '@angular/core';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-heading',
  standalone: true,
  template: `
    <h2 [class]="headingClass" style="text-wrap: balance;">
      <ng-content />
    </h2>
  `,
})
export class HeadingComponent {
  @Input() className = '';
  @Input() size: 'sm' | 'md' | 'xl' | '2xl' = 'md';

  get headingClass() {
    const sizeVariants: Record<string, string> = {
      sm: 'text-xl md:text-2xl md:leading-snug',
      md: 'text-3xl md:text-4xl md:leading-tight',
      xl: 'text-4xl md:text-6xl md:leading-none',
      '2xl': 'text-5xl md:text-7xl md:leading-none',
    };
    return cn(
      'text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight',
      'font-medium',
      'bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white',
      sizeVariants[this.size],
      this.className
    );
  }
}
