import { Component, Input } from '@angular/core';
import { cn } from '../../../utils/utils';

@Component({
  selector: 'app-feature-icon-container',
  standalone: true,
  template: `
    <div class="[perspective:400px] [transform-style:preserve-3d]">
      <div
        [class]="cn('h-14 w-14 p-[4px] rounded-md bg-gradient-to-b from-neutral-800 to-neutral-950 mx-auto relative')"
        style="transform: rotateX(25deg); transform-origin: center;"
      >
        <div [class]="innerClass">
          <ng-content />
        </div>
        <div class="absolute bottom-0 inset-x-0 bg-neutral-600 opacity-50 rounded-full blur-lg h-4 w-full mx-auto z-30"></div>
        <div class="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-neutral-500 to-transparent h-px w-[60%] mx-auto"></div>
        <div class="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-neutral-600 blur-sm to-transparent h-[8px] w-[60%] mx-auto"></div>
      </div>
    </div>
  `,
})
export class FeatureIconContainerComponent {
  @Input() className = '';
  cn = cn;

  get innerClass() {
    return cn(
      'bg-charcoal rounded-[5px] h-full w-full relative z-20',
      this.className
    );
  }
}
