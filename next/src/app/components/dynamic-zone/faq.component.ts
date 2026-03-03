import { Component, Input } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { HeadingComponent } from '../elements/heading.component';
import { FeatureIconContainerComponent } from './features/feature-icon-container.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [ContainerComponent, HeadingComponent, FeatureIconContainerComponent],
  template: `
    <app-container className="flex flex-col items-center justify-between pb-20">
      <div class="relative z-20 py-10 md:pt-40">
        <app-feature-icon-container className="flex justify-center items-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        </app-feature-icon-container>
        <app-heading as="h1" className="mt-4">{{ heading }}</app-heading>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 py-20">
        @if (faqs) {
          @for (faq of faqs; track faq.question) {
            <div>
              <h4 class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
                {{ faq.question }}
              </h4>
              <p class="mt-4 text-neutral-400">{{ faq.answer }}</p>
            </div>
          }
        }
      </div>
    </app-container>
  `,
})
export class FaqComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() faqs: any[] = [];
}
