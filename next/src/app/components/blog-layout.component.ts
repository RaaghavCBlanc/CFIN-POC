import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { format } from 'date-fns';
import { ContainerComponent } from './container/container.component';
import { AmbientColorComponent } from './decorations/ambient-color.component';
import { DynamicZoneManagerComponent } from './dynamic-zone/manager.component';
import { StrapiImageComponent } from './ui/strapi-image.component';
import { StrapiBlocksComponent } from './ui/strapi-blocks.component';

@Component({
  selector: 'app-blog-layout',
  standalone: true,
  imports: [
    RouterLink,
    ContainerComponent,
    AmbientColorComponent,
    DynamicZoneManagerComponent,
    StrapiImageComponent,
    StrapiBlocksComponent,
  ],
  template: `
    <div class="relative overflow-hidden">
      <app-ambient-color />
      <app-container className="mt-16 lg:mt-32">
        <div class="flex justify-between items-center px-2 py-8">
          <a [routerLink]="'/' + locale + '/blog'" class="flex space-x-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m5 12 6-6"/><path d="m5 12 6 6"/></svg>
            <span class="text-sm text-muted">Back</span>
          </a>
        </div>
        <div class="w-full mx-auto">
          @if (article?.image) {
            <app-strapi-image
              [src]="article.image.url"
              [height]="800"
              [width]="800"
              className="h-40 md:h-96 w-full aspect-square object-cover rounded-3xl"
              [alt]="article.title"
            />
          } @else {
            <div class="h-40 md:h-96 w-full aspect-square rounded-3xl shadow-derek bg-neutral-900 flex items-center justify-center"></div>
          }
        </div>
        <div class="xl:relative">
          <div class="mx-auto max-w-2xl">
            <article class="pb-8 pt-8">
              <div class="flex gap-4 flex-wrap">
                @for (category of article?.categories || []; track $index) {
                  <p class="text-xs font-bold text-muted px-2 py-1 rounded-full bg-neutral-800 capitalize">
                    {{ category.name }}
                  </p>
                }
              </div>
              <header class="flex flex-col">
                <h1 class="mt-8 text-4xl font-bold tracking-tight text-neutral-200 sm:text-5xl">
                  {{ article?.title }}
                </h1>
              </header>
              <div class="mt-8 prose prose-sm prose-invert">
                <app-strapi-blocks [content]="article?.content" />
              </div>
              <div class="flex space-x-2 items-center pt-12 border-t border-neutral-800 mt-12">
                <div class="flex space-x-2 items-center"></div>
                <div class="h-5 rounded-lg w-0.5 bg-neutral-700"></div>
                @if (article?.publishedAt) {
                  <time [attr.dateTime]="article.publishedAt" class="flex items-center text-base">
                    <span class="text-muted text-sm">
                      {{ formatDate(article.publishedAt) }}
                    </span>
                  </time>
                }
              </div>
            </article>
          </div>
        </div>
        @if (article?.dynamic_zone) {
          <app-dynamic-zone-manager
            [dynamicZone]="article.dynamic_zone"
            [locale]="locale"
          />
        }
      </app-container>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class BlogLayoutComponent {
  @Input() article: any;
  @Input() locale = 'en';

  formatDate(dateStr: string): string {
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  }
}
