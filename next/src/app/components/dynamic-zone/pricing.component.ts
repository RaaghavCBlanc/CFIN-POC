import { Component, Input } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { ButtonComponent } from '../elements/button.component';
import { HeadingComponent } from '../elements/heading.component';
import { SubheadingComponent } from '../elements/subheading.component';
import { FeatureIconContainerComponent } from './features/feature-icon-container.component';
import { cn } from '../../utils/utils';

const translations: Record<string, { currency: string; featured: string }> = {
  en: { currency: '$', featured: 'Featured' },
  fr: { currency: '€', featured: 'En vedette' },
};

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    ContainerComponent,
    ButtonComponent,
    HeadingComponent,
    SubheadingComponent,
    FeatureIconContainerComponent,
  ],
  template: `
    <div class="pt-40">
      <app-container>
        <app-feature-icon-container className="flex justify-center items-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
            <path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>
          </svg>
        </app-feature-icon-container>
        <app-heading className="pt-4">{{ heading }}</app-heading>
        <app-subheading className="max-w-3xl mx-auto">{{ sub_heading }}</app-subheading>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 py-20 lg:items-start">
          @for (plan of plans; track plan.name) {
            <div [class]="getPlanContainerClass(getDisplayPlan(plan))">
              <div [class]="getPlanHeaderClass(getDisplayPlan(plan))">
                <div class="flex justify-between items-center">
                  <p [class]="cn('font-medium', getDisplayPlan(plan).featured && 'text-black')">{{ getDisplayPlan(plan).name }}</p>
                  @if (getDisplayPlan(plan).featured) {
                    <div class="font-medium text-xs px-3 py-1 rounded-full relative bg-neutral-900">
                      <div class="absolute inset-x-0 bottom-0 w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                      {{ t.featured }}
                    </div>
                  }
                </div>
                <div class="mt-8 flex items-baseline">
                  @if (getDisplayPlan(plan).price) {
                    <span [class]="cn('text-lg font-bold text-neutral-500', getDisplayPlan(plan).featured && 'text-neutral-700')">{{ t.currency }}</span>
                  }
                  <span [class]="cn('text-4xl font-bold', getDisplayPlan(plan).featured && 'text-black')">{{ getDisplayPlan(plan).price || getDisplayPlan(plan)?.CTA?.text }}</span>
                  @if (getDisplayPlan(plan).price) {
                    <span [class]="cn('text-lg font-normal text-neutral-500 ml-2', getDisplayPlan(plan).featured && 'text-neutral-700')">launch</span>
                  }
                </div>
                <app-button
                  variant="outline"
                  [className]="cn('w-full mt-10 mb-4', getDisplayPlan(plan).featured && 'bg-black text-white hover:bg-black/80 hover:text-white')"
                  (click)="onPlanClick(getDisplayPlan(plan))"
                >
                  {{ getDisplayPlan(plan)?.CTA?.text }}
                </app-button>
              </div>
              <div class="mt-1 p-4">
                @for (perk of getDisplayPlan(plan).perks; track $index) {
                  <div class="flex items-start justify-start gap-2 my-4">
                    <div [class]="cn('h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', 'bg-neutral-700')">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 [stroke-width:4px] text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div [class]="cn('font-medium text-white text-sm', getDisplayPlan(plan).featured && 'text-black')">{{ perk.text }}</div>
                  </div>
                }
              </div>
              @if (getDisplayPlan(plan).additional_perks?.length) {
                <!-- Divider -->
                <div class="relative">
                  <div [class]="cn('w-full h-px bg-neutral-950', getDisplayPlan(plan).featured && 'bg-white')"></div>
                  <div [class]="cn('w-full h-px bg-neutral-800', getDisplayPlan(plan).featured && 'bg-neutral-200')"></div>
                  <div [class]="cn('absolute inset-0 h-5 w-5 m-auto rounded-xl bg-neutral-800 shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center', getDisplayPlan(plan).featured && 'bg-white shadow-aceternity')">
                    <svg xmlns="http://www.w3.org/2000/svg" [class]="cn('h-3 w-3 [stroke-width:4px] text-neutral-300', getDisplayPlan(plan).featured && 'text-black')" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </div>
                </div>
              }
              <div class="p-4">
                @for (perk of getDisplayPlan(plan).additional_perks; track $index) {
                  <div class="flex items-start justify-start gap-2 my-4">
                    <div class="h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 [stroke-width:4px] text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div [class]="cn('font-medium text-white text-sm', getDisplayPlan(plan).featured && 'text-black')">{{ perk.text }}</div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </app-container>
    </div>
  `,
})
export class PricingComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() plans: any[] = [];
  @Input() locale = 'en';

  cn = cn;

  get t() {
    return translations[this.locale] || translations['en'];
  }

  getDisplayPlan(plan: any): any {
    if (plan.localizations?.length) {
      const localized = plan.localizations.find((p: any) => p.locale === this.locale);
      if (localized) return localized;
    }
    return plan;
  }

  getPlanContainerClass(plan: any): string {
    return cn(
      'p-4 md:p-4 rounded-3xl bg-neutral-900 border-2 border-neutral-800',
      plan.featured && 'border-neutral-50 bg-neutral-100'
    );
  }

  getPlanHeaderClass(plan: any): string {
    return cn(
      'p-4 bg-neutral-800 rounded-2xl shadow-[0px_-1px_0px_0px_var(--neutral-700)]',
      plan.featured && 'bg-white shadow-aceternity'
    );
  }

  onPlanClick(plan: any): void {
    console.log('click', plan);
  }
}
