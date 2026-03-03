import { Component, Input } from '@angular/core';
import { ContainerComponent } from '../../container/container.component';
import { HeadingComponent } from '../../elements/heading.component';
import { SubheadingComponent } from '../../elements/subheading.component';
import { GradientContainerComponent } from '../../gradient-container/gradient-container.component';
import { CardComponent, CardTitleComponent, CardDescriptionComponent, CardSkeletonContainerComponent } from './card.component';
import { FeatureIconContainerComponent } from './feature-icon-container.component';
import { SkeletonOneComponent } from './skeleton-one.component';
import { SkeletonTwoComponent } from './skeleton-two.component';
import { SkeletonThreeComponent } from './skeleton-three.component';
import { SkeletonFourComponent } from './skeleton-four.component';

const wordToNumber: Record<string, number> = { one: 1, two: 2, three: 3 };
function convertWordToNumber(word: string): number | null {
  return wordToNumber[word?.toLowerCase()] || null;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [
    ContainerComponent,
    HeadingComponent,
    SubheadingComponent,
    GradientContainerComponent,
    CardComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardSkeletonContainerComponent,
    FeatureIconContainerComponent,
    SkeletonOneComponent,
    SkeletonTwoComponent,
    SkeletonThreeComponent,
    SkeletonFourComponent,
  ],
  template: `
    <app-gradient-container className="md:my-20">
      <app-container className="py-20 max-w-7xl mx-auto relative z-40">
        <app-feature-icon-container className="flex justify-center items-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 13c3.5-2 8-2 10 1a5.5 5.5 0 0 1 8 5"/>
            <path d="m5.15 17.89 5.09-4.19"/>
            <path d="m10.15 13.89 5.09-4.19"/>
            <path d="M12 2v10l4-4"/>
          </svg>
        </app-feature-icon-container>
        <app-heading className="pt-4">{{ heading }}</app-heading>
        <app-subheading className="max-w-3xl mx-auto">{{ sub_heading }}</app-subheading>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 py-10">
          @if (globe_card) {
            <app-card [className]="'md:col-span-' + (getSpan(globe_card?.span) || '2')">
              <app-card-title>{{ globe_card.title }}</app-card-title>
              <app-card-description>{{ globe_card.description }}</app-card-description>
              <app-card-skeleton-container>
                <app-skeleton-one />
              </app-card-skeleton-container>
            </app-card>
          }

          @if (ray_card) {
            <app-card [className]="'md:col-span-' + (getSpan(ray_card?.span) || '1')">
              <app-card-skeleton-container className="max-w-[16rem] mx-auto">
                <app-skeleton-two />
              </app-card-skeleton-container>
              <app-card-title>{{ ray_card.title }}</app-card-title>
              <app-card-description>{{ ray_card.description }}</app-card-description>
            </app-card>
          }

          @if (graph_card) {
            <app-card [className]="'md:col-span-' + (getSpan(graph_card?.span) || '2')">
              <app-card-skeleton-container [showGradient]="false" className="max-w-[16rem] mx-auto">
                <app-skeleton-three />
              </app-card-skeleton-container>
              <app-card-title>{{ graph_card.title }}</app-card-title>
              <app-card-description>{{ graph_card.description }}</app-card-description>
            </app-card>
          }

          @if (social_media_card) {
            <app-card [className]="'md:col-span-' + (getSpan(social_media_card?.span) || '1')">
              <app-card-skeleton-container [showGradient]="false">
                <app-skeleton-four />
              </app-card-skeleton-container>
              <app-card-title>{{ social_media_card.title }}</app-card-title>
              <app-card-description>{{ social_media_card.description }}</app-card-description>
            </app-card>
          }
        </div>
      </app-container>
    </app-gradient-container>
  `,
})
export class FeaturesComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() globe_card: any;
  @Input() ray_card: any;
  @Input() graph_card: any;
  @Input() social_media_card: any;

  getSpan(word: string): string {
    if (!word) return '';
    return String(convertWordToNumber(word) || '');
  }
}
