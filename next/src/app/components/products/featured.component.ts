import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StrapiImageComponent } from '../ui/strapi-image.component';
import { formatNumber } from '../../utils/utils';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, StrapiImageComponent],
  template: `
    <div class="py-20">
      <h2 class="text-2xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white mb-2">
        {{ heading || 'Featured' }}
      </h2>
      <p class="text-neutral-500 text-lg mt-4 mb-10">
        {{ sub_heading || 'Pick from our most popular collection' }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        @if (firstProduct) {
          <div class="md:col-span-2">
            <ng-container *ngTemplateOutlet="featuredItem; context: { $implicit: firstProduct }" />
          </div>
        }
        <div class="grid gap-10">
          @if (secondProduct) {
            <ng-container *ngTemplateOutlet="featuredItem; context: { $implicit: secondProduct }" />
          }
          @if (thirdProduct) {
            <ng-container *ngTemplateOutlet="featuredItem; context: { $implicit: thirdProduct }" />
          }
        </div>
      </div>
    </div>

    <ng-template #featuredItem let-product>
      <a
        [routerLink]="'/' + locale + '/products/' + product.slug"
        class="group border border-neutral-800 rounded-md overflow-hidden relative block"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black transition-all duration-200 z-30"></div>
        <div class="absolute text-sm top-4 right-2 md:top-10 md:right-10 z-40 bg-white rounded-full pr-1 pl-4 py-1 text-black font-medium flex gap-4 items-center">
          <span>{{ product.name }}</span>
          <span class="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-2 py-1 rounded-full">
            {{ currencySymbol }}{{ formatNum(product.price) }}
          </span>
        </div>
        <app-strapi-image
          [src]="product.images?.[0]?.url"
          [alt]="product.name"
          [width]="1000"
          [height]="1000"
          className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
        />
      </a>
    </ng-template>
  `,
  styles: [`:host { display: block; }`],
})
export class FeaturedComponent {
  @Input() heading?: string | null;
  @Input() sub_heading?: string | null;
  @Input() products: any[] = [];
  @Input() locale = 'en';

  get firstProduct() { return this.products?.[0] || null; }
  get secondProduct() { return this.products?.[1] || null; }
  get thirdProduct() { return this.products?.[2] || null; }

  get currencySymbol(): string {
    return this.locale === 'fr' ? '€' : '$';
  }

  formatNum(price: number): string {
    return formatNumber(price, this.locale);
  }
}
