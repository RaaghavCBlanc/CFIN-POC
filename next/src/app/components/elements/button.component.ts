import { Component, Input } from '@angular/core';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    @if (href) {
      <a [href]="href" [class]="buttonClass" [attr.target]="target">
        <ng-content />
      </a>
    } @else {
      <button [class]="buttonClass" [type]="type" [disabled]="disabled" (click)="onClick?.()">
        <ng-content />
      </button>
    }
  `,
})
export class ButtonComponent {
  @Input() variant: 'simple' | 'outline' | 'primary' | 'muted' = 'primary';
  @Input() className = '';
  @Input() href?: string;
  @Input() target?: string;
  @Input() type = 'button';
  @Input() disabled = false;
  @Input() onClick?: () => void;

  get buttonClass() {
    const variantClass =
      this.variant === 'simple'
        ? 'relative z-10 bg-transparent hover:border-secondary/50 hover:bg-secondary/10 border border-transparent text-white text-sm md:text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center'
        : this.variant === 'outline'
          ? 'bg-white relative z-10 hover:bg-secondary/90 hover:shadow-xl text-black border border-black hover:text-black text-sm md:text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center'
          : this.variant === 'primary'
            ? 'bg-secondary relative z-10 hover:bg-secondary/90 border border-secondary text-black text-sm md:text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF60_inset,_0px_1px_0px_0px_#FFFFFF60_inset] hover:-translate-y-1 active:-translate-y-0'
            : this.variant === 'muted'
              ? 'bg-neutral-800 relative z-10 hover:bg-neutral-900 border border-transparent text-white text-sm md:text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center shadow-[0px_1px_0px_0px_#FFFFFF20_inset]'
              : '';

    return cn(variantClass, this.className);
  }
}
