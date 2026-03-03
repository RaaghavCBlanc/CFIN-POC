import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-icon',
  standalone: true,
  host: { '[class]': '"block"' },
  template: `
    <div
      class="pointer-events-none h-2 w-2 rounded-full bg-white"
      [style.animation]="'pulse-opacity ' + duration + 's linear ' + delay + 's infinite alternate'"
    ></div>
  `,
  styles: [`
    @keyframes pulse-opacity {
      0% { opacity: 0.2; }
      50% { opacity: 0.5; }
      100% { opacity: 0.2; }
    }
    :host { display: block; }
  `],
})
export class CircleIconComponent {
  @Input() delay = 0;
  @Input() duration = 1;
}

@Component({
  selector: 'app-cover',
  standalone: true,
  imports: [CircleIconComponent],
  template: `
    <div class="relative inline-block bg-neutral-900 px-2 py-1">
      <span class="text-white"><ng-content /></span>
      <app-circle-icon class="absolute -right-[2px] -top-[2px]" [delay]="0" />
      <app-circle-icon class="absolute -bottom-[2px] -right-[2px]" [delay]="0.4" />
      <app-circle-icon class="absolute -left-[2px] -top-[2px]" [delay]="0.8" />
      <app-circle-icon class="absolute -bottom-[2px] -left-[2px]" [delay]="1.6" />
    </div>
  `,
})
export class CoverComponent {}
