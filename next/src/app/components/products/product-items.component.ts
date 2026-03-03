import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StrapiImageComponent } from '../ui/strapi-image.component';
import { formatNumber, truncate } from '../../utils/utils';

@Component({
  selector: 'app-product-items',
  standalone: true,
  imports: [RouterLink, StrapiImageComponent],
  template: `
    <div class="py-20">
      <h2 class="text-2xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white mb-2">
        {{ heading || 'Popular' }}
      </h2>
      <p class="text-neutral-500 text-lg mt-4 mb-10">
        {{ sub_heading || 'Recently rose to popularity' }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-20">
        @for (product of products; track product.id) {
          <a
            [routerLink]="'/' + locale + '/products/' + product.slug"
            class="group relative block"
          >
            <div class="relative border border-neutral-800 rounded-md overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black transition-all duration-200 z-30"></div>
              <app-strapi-image
                [src]="product?.images?.[0]?.url"
                [alt]="product.name"
                [width]="600"
                [height]="600"
                className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
              />
            </div>
            <div class="mt-8">
              <div class="flex justify-between">
                <span class="text-white text-base font-medium">{{ product.name }}</span>
                <span class="bg-white text-black shadow-derek text-xs px-2 py-1 rounded-full">
                  {{ currencySymbol }}{{ formatNum(product.price) }}
                </span>
              </div>
              <p class="text-neutral-400 text-sm mt-4">
                {{ truncateText(product.description, 100) }}
              </p>
            </div>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class ProductItemsComponent {
  @Input() heading?: string | null;
  @Input() sub_heading?: string | null;
  @Input() products: any[] = [];
  @Input() locale = 'en';

  truncateText = truncate;

  get currencySymbol(): string {
    return this.locale === 'fr' ? '€' : '$';
  }

  formatNum(price: number): string {
    return formatNumber(price, this.locale);
  }
}
