import { Component, Input } from '@angular/core';
import { ContainerComponent } from '../../container/container.component';
import { HeadingComponent } from '../../elements/heading.component';
import { SubheadingComponent } from '../../elements/subheading.component';
import { FeatureIconContainerComponent } from '../features/feature-icon-container.component';
import { HowItWorksCardComponent } from './how-it-works-card.component';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [
    ContainerComponent,
    HeadingComponent,
    SubheadingComponent,
    FeatureIconContainerComponent,
    HowItWorksCardComponent,
  ],
  template: `
    <div>
      <app-container className="py-20 max-w-7xl mx-auto relative z-40">
        <app-feature-icon-container className="flex justify-center items-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </app-feature-icon-container>
        <app-heading className="pt-4">{{ heading }}</app-heading>
        <app-subheading className="max-w-3xl mx-auto">{{ sub_heading }}</app-subheading>

        @if (steps) {
          @for (item of steps; track $index) {
            <app-how-it-works-card
              [title]="item.title"
              [description]="item.description"
              [index]="$index + 1"
            />
          }
        }
      </app-container>
    </div>
  `,
})
export class HowItWorksComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() steps: any[] = [];
}
