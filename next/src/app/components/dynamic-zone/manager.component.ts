import { Component, Input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { HeroComponent } from './hero.component';
import { FeaturesComponent } from './features/features.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { BrandsComponent } from './brands.component';
import { PricingComponent } from './pricing.component';
import { LaunchesComponent } from './launches.component';
import { CtaComponent } from './cta.component';
import { FormNextToSectionComponent } from './form-next-to-section.component';
import { FaqComponent } from './faq.component';
import { RelatedProductsComponent } from './related-products.component';
import { RelatedArticlesComponent } from './related-articles.component';

const COMPONENT_MAP: Record<string, any> = {
  'dynamic-zone.hero': HeroComponent,
  'dynamic-zone.features': FeaturesComponent,
  'dynamic-zone.testimonials': TestimonialsComponent,
  'dynamic-zone.how-it-works': HowItWorksComponent,
  'dynamic-zone.brands': BrandsComponent,
  'dynamic-zone.pricing': PricingComponent,
  'dynamic-zone.launches': LaunchesComponent,
  'dynamic-zone.cta': CtaComponent,
  'dynamic-zone.form-next-to-section': FormNextToSectionComponent,
  'dynamic-zone.faq': FaqComponent,
  'dynamic-zone.related-products': RelatedProductsComponent,
  'dynamic-zone.related-articles': RelatedArticlesComponent,
};

@Component({
  selector: 'app-dynamic-zone-manager',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    <div>
      @for (item of dynamicZone; track trackByFn($index, item)) {
        <ng-container *ngComponentOutlet="getComponent(item); inputs: getInputs(item)" />
      }
    </div>
  `,
})
export class DynamicZoneManagerComponent {
  @Input() dynamicZone: any[] = [];
  @Input() locale = 'en';

  getComponent(item: any): any {
    const comp = COMPONENT_MAP[item.__component];
    if (!comp) {
      console.warn(`No component found for: ${item.__component}`);
    }
    return comp || null;
  }

  getInputs(item: any): Record<string, any> {
    return { ...item, locale: this.locale };
  }

  trackByFn(index: number, item: any): string {
    return `${item.__component}-${item.id}-${index}`;
  }
}
