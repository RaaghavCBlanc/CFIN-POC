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
      class="grid grid-cols-1 md:grid-cols-2 group w-full overflow-hidden hover:shadow-lg transition duration-200 rounded-lg border border-gray-200"
      [routerLink]="'/' + locale + '/blog/' + article.slug"
    >
      <div>
        @if (article.image) {
          <app-blur-image
            [src]="getStrapiImage(article.image.url)"
            [alt]="article.title"
            [height]="1200"
            [width]="1200"
            className="h-full object-cover object-top w-full"
          />
        } @else {
          <div class="h-full flex items-center justify-center bg-gray-100"></div>
        }
      </div>
      <div class="p-4 md:p-8 bg-white flex flex-col justify-between">
        <div>
          <div class="flex gap-4 flex-wrap mb-4">
            @for (category of article.categories || []; track $index) {
              <p class="text-xs font-bold text-white px-4 py-1.5 rounded-full bg-gray-700 capitalize">{{ category.name }}</p>
            }
          </div>
          <p class="text-lg md:text-3xl font-bold mb-4 text-gray-900">{{ article.title }}</p>
          <p class="text-left text-base md:text-lg mt-2 text-gray-600">{{ truncateText(article.description, 500) }}</p>
        </div>
        <div class="flex space-x-2 items-center mt-6">
          <div class="h-1 w-1 bg-gray-400 rounded-full"></div>
          <p class="text-gray-500 text-sm">
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
      class="rounded-lg group border border-gray-200 w-full overflow-hidden hover:shadow-lg transition duration-200 block bg-white"
      [routerLink]="'/' + locale + '/blog/' + article.slug"
    >
      <div>
        @if (article.image) {
          <app-blur-image
            [src]="getStrapiImage(article.image.url || '')"
            [alt]="article.title"
            [height]="800"
            [width]="800"
            className="h-64 md:h-96 object-cover object-top w-full"
          />
        } @else {
          <div class="h-64 md:h-96 flex items-center justify-center bg-gray-100"></div>
        }
      </div>
      <div class="p-4 md:p-8 flex flex-col justify-between">
        <div>
          <div class="flex gap-4 flex-wrap mb-4">
            @for (category of article.categories || []; track $index) {
              <p class="text-xs font-bold text-white px-4 py-1.5 rounded-full bg-gray-700 capitalize">{{ category.name }}</p>
            }
          </div>
          <p class="text-lg md:text-xl font-bold mb-4 text-gray-900">{{ article.title }}</p>
          <p class="text-left text-sm md:text-base mt-2 text-gray-600">{{ truncateText(article.description, 500) }}</p>
        </div>
        <div class="flex space-x-2 items-center mt-6">
          <div class="h-1 w-1 bg-gray-400 rounded-full"></div>
          <p class="text-gray-500 text-sm">
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
