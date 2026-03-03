import { Component, Input } from '@angular/core';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-subheading',
  standalone: true,
  template: `
    <h2 [class]="subheadingClass" style="text-wrap: balance;">
      <ng-content />
    </h2>
  `,
})
export class SubheadingComponent {
  @Input() className = '';

  get subheadingClass() {
    return cn(
      'text-sm md:text-base max-w-4xl text-left my-4 mx-auto',
      'text-muted text-center font-normal',
      this.className
    );
  }
}
