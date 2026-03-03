import { Component, Input } from '@angular/core';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-container',
  standalone: true,
  template: `
    <div [class]="containerClass">
      <ng-content />
    </div>
  `,
})
export class ContainerComponent {
  @Input() className = '';

  get containerClass() {
    return cn('max-w-7xl mx-auto px-4 md:px-10 xl:px-4', this.className);
  }
}
