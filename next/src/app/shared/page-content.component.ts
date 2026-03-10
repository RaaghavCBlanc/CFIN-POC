import { Component, Input } from '@angular/core';
import { AmbientColorComponent } from '../components/decorations/ambient-color.component';
import { DynamicZoneManagerComponent } from '../components/dynamic-zone/manager.component';

@Component({
  selector: 'app-page-content',
  standalone: true,
  imports: [AmbientColorComponent, DynamicZoneManagerComponent],
  template: `
    <div class="relative overflow-hidden w-full">
      @if (showAmbient) {
        <app-ambient-color />
      }
      @if (pageData?.dynamic_zone) {
        <app-dynamic-zone-manager
          [dynamicZone]="pageData.dynamic_zone"
          [locale]="pageData.locale || 'en'"
        />
      }
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class PageContentComponent {
  @Input() pageData: any;
  @Input() showAmbient = true;
}