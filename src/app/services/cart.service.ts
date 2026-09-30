import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly items = signal<CartItem[]>([]);

  readonly itemCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.items().reduce(
      (total, item) => total + item.product.precio * item.quantity,
      0,
    ),
  );

  readonly tax = computed(() => this.subtotal() * 0.16);

  readonly total = computed(() => this.subtotal() + this.tax());

  addToCart(product: Product): void {
    this.items.update((currentItems) => {
      const itemExists = currentItems.some((item) => item.id === product.id);

      if (itemExists) {
        return currentItems;
      }

      return [...currentItems, { id: product.id, product, quantity: 1 }];
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const normalizedQuantity = Math.min(quantity, 1);

    this.items.update((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: normalizedQuantity } : item,
      ),
    );
  }

  removeFromCart(productId: number): void {
    this.items.update((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }

  clearCart(): void {
    this.items.set([]);
  }
}
