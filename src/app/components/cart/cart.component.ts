import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;
  readonly tax = this.cartService.tax;
  readonly total = this.cartService.total;

  updateQuantity(productId: number, delta: number): void {
    const item = this.items().find((entry) => entry.id === productId);

    if (!item) {
      return;
    }

    this.cartService.updateQuantity(productId, item.quantity + delta);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}
