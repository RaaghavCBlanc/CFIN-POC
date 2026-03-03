import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../container/container.component';
import { AmbientColorComponent } from '../decorations/ambient-color.component';
import { ButtonComponent } from '../elements/button.component';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [RouterLink, ContainerComponent, AmbientColorComponent, ButtonComponent],
  template: `
    <div class="relative py-40">
      <app-ambient-color />
      <app-container className="flex flex-col md:flex-row justify-between items-center w-full px-8">
        <div class="flex flex-col">
          <h2 class="text-white text-xl text-center md:text-left md:text-3xl font-bold mx-auto md:mx-0 max-w-xl">
            {{ heading }}
          </h2>
          <p class="max-w-md mt-8 text-center md:text-left text-sm md:text-base mx-auto md:mx-0 text-neutral-400">
            {{ sub_heading }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          @if (CTAs) {
            @for (cta of CTAs; track $index) {
              <app-button
                [routerLink]="'/' + locale + cta.URL"
                [variant]="cta.variant || 'primary'"
                className="py-3"
              >
                {{ cta.text }}
              </app-button>
            }
          }
        </div>
      </app-container>
    </div>
  `,
})
export class CtaComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() CTAs: any[] = [];
  @Input() locale = 'en';
}
