import { Component, Input } from '@angular/core';
import { cn } from '../../../utils/utils';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="cardClass">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() className = '';

  get cardClass(): string {
    return cn(
      'p-8 rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group',
      this.className
    );
  }
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `
    <h3 [class]="titleClass">
      <ng-content />
    </h3>
  `,
})
export class CardTitleComponent {
  @Input() className = '';

  get titleClass(): string {
    return cn('text-lg font-semibold text-white py-2', this.className);
  }
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  template: `
    <p [class]="descClass">
      <ng-content />
    </p>
  `,
})
export class CardDescriptionComponent {
  @Input() className = '';

  get descClass(): string {
    return cn('text-sm font-normal text-neutral-400 max-w-sm', this.className);
  }
}

@Component({
  selector: 'app-card-skeleton-container',
  standalone: true,
  template: `
    <div [class]="containerClass">
      <ng-content />
    </div>
  `,
})
export class CardSkeletonContainerComponent {
  @Input() className = '';
  @Input() showGradient = true;

  get containerClass(): string {
    return cn(
      'h-[20rem] rounded-xl z-40',
      this.className,
      this.showGradient &&
        'bg-[rgba(40,40,40,0.30)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]'
    );
  }
}
