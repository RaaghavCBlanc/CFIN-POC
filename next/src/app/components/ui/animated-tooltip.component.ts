import { Component, Input, signal } from '@angular/core';
import { StrapiImageComponent } from './strapi-image.component';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-animated-tooltip',
  standalone: true,
  imports: [StrapiImageComponent],
  template: `
    @for (item of items; track item.id) {
      <div
        class="-mr-4 relative group"
        (mouseenter)="hoveredIndex.set(item.id)"
        (mouseleave)="hoveredIndex.set(null)"
      >
        @if (hoveredIndex() === item.id) {
          <div
            class="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2 tooltip-enter"
            style="white-space: nowrap;"
          >
            <div class="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px"></div>
            <div class="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px"></div>
            <div class="font-bold text-white relative z-30 text-base">
              {{ item.firstname }} {{ item.lastname }}
            </div>
            <div class="text-white text-xs">{{ item.job }}</div>
          </div>
        }
        <app-strapi-image
          [src]="item?.image?.url"
          [alt]="item?.image?.alternativeText"
          [height]="100"
          [width]="100"
          className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
        />
      </div>
    }
  `,
  styles: [`
    .tooltip-enter {
      animation: tooltipIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes tooltipIn {
      from { opacity: 0; transform: translateY(20px) scale(0.6); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `],
})
export class AnimatedTooltipComponent {
  @Input() items: any[] = [];
  hoveredIndex = signal<number | null>(null);
}
