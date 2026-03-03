import { Component, Input, inject } from '@angular/core';
import { StrapiImageComponent } from '../ui/strapi-image.component';
import { CartService } from '../../services/cart.service';
import { formatNumber } from '../../utils/utils';
import { ModalService } from '../ui/animated-modal.component';

@Component({
  selector: 'app-add-to-cart-modal',
  standalone: true,
  imports: [StrapiImageComponent],
  template: `
    <button
      (click)="onAddToCart()"
      class="mt-10 w-full bg-white text-black font-medium px-4 py-3 rounded-md hover:bg-white/90 transition duration-200"
    >
      {{ ctaText }}
    </button>
  `,
  styles: [`:host { display: block; }`],
})
export class AddToCartModalComponent {
  @Input() ctaText = 'Add to cart';
  @Input() buyNowText = 'Buy now';
  @Input() locale = 'en';
  @Input() product: any;

  private cartService = inject(CartService);
  private modalService = inject(ModalService);

  onAddToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
    this.modalService.setOpen(true);
  }
}

@Component({
  selector: 'app-cart-modal-content',
  standalone: true,
  imports: [StrapiImageComponent],
  template: `
    @if (modalService.open()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center" (click)="onBackdropClick($event)">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>
        <div class="relative bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto z-10 cart-modal-enter">
          <button (click)="modalService.setOpen(false)" class="absolute top-4 right-4 text-neutral-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          <h4 class="text-lg md:text-2xl text-neutral-600 font-bold text-center mb-8">Your cart</h4>

          @if (cartService.items().length === 0) {
            <p class="text-center text-neutral-700">Your cart is empty. Please purchase something.</p>
          }

          <div class="flex flex-col divide-y divide-neutral-100">
            @for (item of cartService.items(); track item.product.id) {
              <div class="flex gap-2 justify-between items-center py-4">
                <div class="flex items-center gap-4">
                  <app-strapi-image
                    [src]="item.product?.images?.[0]?.url"
                    [alt]="item.product.name"
                    [width]="60"
                    [height]="60"
                    className="rounded-lg hidden md:block"
                  />
                  <span class="text-black text-sm md:text-base font-medium">{{ item.product.name }}</span>
                </div>
                <div class="flex items-center">
                  <input
                    type="number"
                    [value]="item.quantity"
                    (change)="onQuantityChange(item, $event)"
                    min="1"
                    step="1"
                    class="w-16 p-2 h-full rounded-md focus:outline-none bg-neutral-50 border border-neutral-100 focus:bg-neutral-100 text-black mr-4"
                    style="-webkit-appearance: none; -moz-appearance: textfield;"
                  />
                  <div class="text-black text-sm font-medium w-20">
                    {{ currencySymbol }}{{ formatNum(item.product.price) }}
                  </div>
                  <button (click)="cartService.removeFromCart(item.product.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            }
          </div>

          <div class="flex justify-between items-center mt-6 pt-4 border-t border-neutral-200">
            <div class="text-neutral-700">
              Total
              <span class="font-bold ml-1">{{ currencySymbol }}{{ formatNum(cartService.getCartTotal()) }}</span>
            </div>
            <button
              [disabled]="cartService.items().length === 0"
              class="bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2 rounded-md border border-black w-28"
            >
              {{ buyNowText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes cartModalIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .cart-modal-enter {
      animation: cartModalIn 0.2s ease-out forwards;
    }
  `],
})
export class CartModalContentComponent {
  @Input() buyNowText = 'Buy now';
  @Input() locale = 'en';

  cartService = inject(CartService);
  modalService = inject(ModalService);

  get currencySymbol(): string {
    return this.locale === 'fr' ? '€' : '$';
  }

  formatNum(price: number): string {
    return formatNumber(price, this.locale);
  }

  onQuantityChange(item: any, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    if (value > 0) {
      this.cartService.updateQuantity(item.product, value);
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.modalService.setOpen(false);
    }
  }
}
