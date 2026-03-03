import { Component, Input, signal, inject } from '@angular/core';
import { StrapiImageComponent } from '../ui/strapi-image.component';
import { AddToCartModalComponent, CartModalContentComponent } from './modal.component';
import { CartService } from '../../services/cart.service';
import { cn, formatNumber, strapiImage } from '../../utils/utils';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [StrapiImageComponent, AddToCartModalComponent, CartModalContentComponent],
  template: `
    <div class="bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 md:p-10 rounded-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Image gallery -->
        <div>
          <div class="rounded-lg relative overflow-hidden product-image-enter" [style.animation-name]="'productSlideIn'" [style.animation-duration]="'0.3s'">
            <app-strapi-image
              [src]="activeThumbnail()"
              [alt]="product?.name"
              [width]="600"
              [height]="600"
              className="rounded-lg object-cover"
            />
          </div>
          <div class="flex gap-4 justify-center items-center mt-4">
            @for (image of product?.images || []; track $index) {
              <button
                (click)="setThumbnail(image.url)"
                [class]="cn('h-20 w-20 rounded-xl', activeThumbnail() === getStrapiImage(image.url) ? 'border-2 border-neutral-200' : 'border-2 border-transparent')"
                [style.backgroundImage]="'url(' + getStrapiImage(image.url) + ')'"
                [style.backgroundSize]="'cover'"
                [style.backgroundPosition]="'center'"
                [style.backgroundRepeat]="'no-repeat'"
              ></button>
            }
          </div>
        </div>

        <!-- Product info -->
        <div>
          <h2 class="text-2xl font-semibold mb-4">{{ product?.name }}</h2>
          <p class="mb-6 bg-white text-xs px-4 py-1 rounded-full text-black w-fit">
            {{ currencySymbol }}{{ formatNum(product?.price || 0) }}
          </p>
          <p class="text-base font-normal mb-4 text-neutral-400">
            {{ product?.description }}
          </p>

          <!-- Divider -->
          <div class="relative">
            <div class="w-full h-px bg-neutral-950"></div>
            <div class="w-full h-px bg-neutral-800"></div>
          </div>

          <!-- Perks -->
          <ul class="list-disc list-inside mb-6">
            @for (perk of product?.perks || []; track $index) {
              <div class="flex items-start justify-start gap-2 my-4">
                <div class="h-4 w-4 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="font-medium text-white text-sm">{{ perk.text }}</div>
              </div>
            }
          </ul>

          <!-- Plans -->
          @if (product?.plans?.length) {
            <h3 class="text-sm font-medium text-neutral-400 mb-2">Available for</h3>
            <ul class="list-none flex gap-4 flex-wrap">
              @for (plan of product.plans; track $index) {
                <li class="bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium">
                  {{ plan.name }}
                </li>
              }
            </ul>
          }

          <!-- Categories -->
          @if (product?.categories?.length) {
            <h3 class="text-sm font-medium text-neutral-400 mb-2 mt-8">Categories</h3>
            <ul class="flex gap-4 flex-wrap">
              @for (category of product.categories; track $index) {
                <li class="bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium">
                  {{ category.name }}
                </li>
              }
            </ul>
          }

          <app-add-to-cart-modal
            [product]="product"
            [ctaText]="addToCartText || 'Add to cart'"
            [buyNowText]="buyNowText || 'Buy now'"
            [locale]="locale"
          />
        </div>
      </div>
    </div>

    <app-cart-modal-content [buyNowText]="buyNowText || 'Buy now'" [locale]="locale" />
  `,
  styles: [`
    @keyframes productSlideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    :host { display: block; }
  `],
})
export class SingleProductComponent {
  @Input() product: any;
  @Input() locale = 'en';
  @Input() addToCartText?: string;
  @Input() buyNowText?: string;

  activeThumbnail = signal('');
  cn = cn;
  getStrapiImage = strapiImage;

  private cartService = inject(CartService);

  ngOnInit() {
    if (this.product?.images?.[0]?.url) {
      this.activeThumbnail.set(strapiImage(this.product.images[0].url));
    }
  }

  setThumbnail(url: string) {
    this.activeThumbnail.set(strapiImage(url));
  }

  get currencySymbol(): string {
    return this.locale === 'fr' ? '€' : '$';
  }

  formatNum(price: number): string {
    return formatNumber(price, this.locale);
  }
}
