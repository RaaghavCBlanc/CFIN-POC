import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../types/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly total = computed(() => {
    return this._items().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  });

  addToCart(product: Product) {
    this._items.update(items => {
      const existing = items.find(item => item.product.id === product.id);
      if (existing) {
        return items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number) {
    this._items.update(items =>
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(product: Product, quantity: number) {
    this._items.update(items =>
      items.map(item =>
        item.product.id === product.id ? { ...item, quantity } : item
      )
    );
  }

  clearCart() {
    this._items.set([]);
  }

  getCartTotal(): number {
    return this.total();
  }
}
