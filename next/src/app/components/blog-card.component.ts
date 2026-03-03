import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { format } from 'date-fns';
import { BlurImageComponent } from './blur-image/blur-image.component';
import { strapiImage } from '../utils/utils';
import { truncate } from '../utils/utils';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterLink, BlurImageComponent],
  template: `
    <a
      class="shadow-derek grid grid-cols-1 md:grid-cols-2 rounded-3xl group border border-transparent hover:border-neutral-800 w-full hover:bg-neutral-900 overflow-hidden hover:scale-[1.02] transition duration-200"
      [routerLink]="'/' + locale + '/blog/' + article.slug"
    >
      <div>
        @if (article.image) {
          <app-blur-image
            [src]="getStrapiImage(article.image.url)"
            [alt]="article.title"
            [height]="1200"
            [width]="1200"
            className="h-full object-cover object-top w-full rounded-3xl"
          />
        } @else {
          <div class="h-full flex items-center justify-center group-hover:bg-neutral-900"></div>
        }
      </div>
      <div class="p-4 md:p-8 group-hover:bg-neutral-900 flex flex-col justify-between">
        <div>
          <div class="flex gap-4 flex-wrap mb-4">
            @for (category of article.categories || []; track $index) {
              <p class="text-xs font-bold text-muted px-4 py-2 rounded-full bg-neutral-800 capitalize">{{ category.name }}</p>
            }
          </div>
          <p class="text-lg md:text-4xl font-bold mb-4">{{ article.title }}</p>
          <p class="text-left text-base md:text-xl mt-2 text-muted">{{ truncateText(article.description, 500) }}</p>
        </div>
        <div class="flex space-x-2 items-center mt-6">
          <div class="h-1 w-1 bg-neutral-300 rounded-full"></div>
          <p class="text-neutral-300 text-sm max-w-xl group-hover:text-white transition duration-200">
            {{ formatDate(article.publishedAt) }}
          </p>
        </div>
      </div>
    </a>
  `,
})
export class BlogCardComponent {
  @Input() article: any;
  @Input() locale = 'en';

  getStrapiImage = strapiImage;
  truncateText = truncate;

  formatDate(dateStr: string): string {
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  }
}

@Component({
  selector: 'app-blog-card-vertical',
  standalone: true,
  imports: [RouterLink, BlurImageComponent],
  template: `
    <a
      class="shadow-derek rounded-3xl group border border-transparent hover:border-neutral-800 w-full hover:bg-neutral-900 overflow-hidden hover:scale-[1.02] transition duration-200 block"
      [routerLink]="'/' + locale + '/blog/' + article.slug"
    >
      <div>
        @if (article.image) {
          <app-blur-image
            [src]="getStrapiImage(article.image.url || '')"
            [alt]="article.title"
            [height]="800"
            [width]="800"
            className="h-64 md:h-96 object-cover object-top w-full rounded-3xl"
          />
        } @else {
          <div class="h-64 md:h-96 flex items-center justify-center group-hover:bg-neutral-900"></div>
        }
      </div>
      <div class="p-4 md:p-8 group-hover:bg-neutral-900 flex flex-col justify-between">
        <div>
          <div class="flex gap-4 flex-wrap mb-4">
            @for (category of article.categories || []; track $index) {
              <p class="text-xs font-bold text-muted px-4 py-2 rounded-full bg-neutral-800 capitalize">{{ category.name }}</p>
            }
          </div>
          <p class="text-lg md:text-xl font-bold mb-4">{{ article.title }}</p>
          <p class="text-left text-sm md:text-base mt-2 text-muted">{{ truncateText(article.description, 500) }}</p>
        </div>
        <div class="flex space-x-2 items-center mt-6">
          <div class="h-1 w-1 bg-neutral-300 rounded-full"></div>
          <p class="text-neutral-300 text-sm max-w-xl group-hover:text-white transition duration-200">
            {{ formatDate(article.publishedAt) }}
          </p>
        </div>
      </div>
    </a>
  `,
})
export class BlogCardVerticalComponent {
  @Input() article: any;
  @Input() locale = 'en';

  getStrapiImage = strapiImage;
  truncateText = truncate;

  formatDate(dateStr: string): string {
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  }
}
