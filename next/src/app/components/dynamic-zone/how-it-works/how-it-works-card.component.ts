import { Component, Input, signal, ElementRef, viewChild } from '@angular/core';
import { BeamComponent } from '../../beam/beam.component';
import { cn } from '../../../utils/utils';

/**
 * HowItWorks Card - replaces framer-motion scroll-based width animation
 * with a CSS-only approach and mouse-move radial gradient effect.
 * CanvasRevealEffect is skipped (3D) - replaced with CSS gradient hover.
 */
@Component({
  selector: 'app-how-it-works-card',
  standalone: true,
  imports: [BeamComponent],
  styles: [`
    .card-reveal {
      mask-image: radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--neutral-900), transparent 80%);
      -webkit-mask-image: radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--neutral-900), transparent 80%);
    }
  `],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 max-w-4xl mx-auto py-20">
      <p class="text-9xl font-bold text-neutral-900 mt-8">{{ '0' + index }}</p>
      <div class="h-px w-full hidden md:block bg-gradient-to-r from-neutral-800 to-neutral-600 rounded-full mt-16 relative overflow-hidden" [style.max-width.px]="300">
        <app-beam className="top-0" />
      </div>
      <div
        class="group p-8 rounded-md border border-neutral-800 bg-neutral-950 relative z-40 col-span-2"
        (mousemove)="onMouseMove($event)"
        #cardRef
      >
        <!-- CanvasRevealEffect placeholder (3D skipped) - CSS gradient hover instead -->
        <div
          class="pointer-events-none absolute z-10 -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100 card-reveal"
          [style.--mouse-x]="mouseX() + 'px'"
          [style.--mouse-y]="mouseY() + 'px'"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-md"></div>
        </div>

        <p class="text-xl font-bold relative z-20 mt-2">{{ title }}</p>
        <p class="text-neutral-400 mt-4 relative z-20">{{ description }}</p>
      </div>
    </div>
  `,
})
export class HowItWorksCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() index = 1;

  mouseX = signal(0);
  mouseY = signal(0);

  private cardEl = viewChild<ElementRef>('cardRef');

  onMouseMove(event: MouseEvent): void {
    const el = this.cardEl()?.nativeElement;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    this.mouseX.set(event.clientX - left);
    this.mouseY.set(event.clientY - top);
  }
}
