import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly isProcessing = signal(false);
  readonly checkoutForm = this.fb.nonNullable.group({
    titular: ['', [Validators.required, Validators.minLength(3)]],
    numeroTarjeta: [
      '',
      [Validators.required, Validators.pattern(/^\d{16}$/)],
    ],
    expiracion: [
      '',
      [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
    ],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  readonly subtotal = this.cartService.subtotal;
  readonly tax = this.cartService.tax;
  readonly total = this.cartService.total;

  submit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isProcessing.set(true);

    window.setTimeout(() => {
      const orderId = this.orderService.createOrder();
      this.cartService.clearCart();
      this.isProcessing.set(false);
      void this.router.navigate(['/order-tracking', orderId]);
    }, 1500);
  }
}
