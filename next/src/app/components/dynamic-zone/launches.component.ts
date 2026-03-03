import { Component, Input } from '@angular/core';
import { HeadingComponent } from '../elements/heading.component';
import { SubheadingComponent } from '../elements/subheading.component';
import { FeatureIconContainerComponent } from './features/feature-icon-container.component';
import { StickyScrollComponent } from '../ui/sticky-scroll.component';

@Component({
  selector: 'app-launches',
  standalone: true,
  imports: [
    HeadingComponent,
    SubheadingComponent,
    FeatureIconContainerComponent,
    StickyScrollComponent,
  ],
  template: `
    <div class="w-full relative h-full pt-20 md:pt-40 bg-charcoal">
      <div class="px-6">
        <app-feature-icon-container className="flex justify-center items-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 13c3.5-2 8-2 10 1a5.5 5.5 0 0 1 8 5"/>
            <path d="m5.15 17.89 5.09-4.19"/>
            <path d="m10.15 13.89 5.09-4.19"/>
            <path d="M12 2v10l4-4"/>
          </svg>
        </app-feature-icon-container>
        <app-heading className="mt-4">{{ heading }}</app-heading>
        <app-subheading>{{ sub_heading }}</app-subheading>
      </div>
      <app-sticky-scroll [content]="enrichedLaunches" />
    </div>
  `,
})
export class LaunchesComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() launches: any[] = [];

  get enrichedLaunches(): any[] {
    return (this.launches || []).map((entry) => ({
      ...entry,
      content_html: `<p class="text-4xl md:text-7xl font-bold text-neutral-800">${entry.mission_number || ''}</p>`,
    }));
  }
}
