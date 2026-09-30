import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderStatus } from '../../models/order-status';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css',
})
export class OrderTrackingComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly destroy$ = new Subject<void>();

  readonly orderId = signal('');
  readonly currentStatus = signal<OrderStatus | null>(null);

  readonly timeline: OrderStatus[] = [
    {
      label: 'Esperando',
      tone: 'neutral',
      message: 'Pendiente',
      icon: '⏳',
    },
    {
      label: 'Esperando confirmación',
      tone: 'warning',
      message: 'Confirmación del pago',
      icon: '🕒',
    },
    {
      label: 'Preparando pedido',
      tone: 'info',
      message: 'Empaque y preparación',
      icon: '📦',
    },
    {
      label: 'En camino',
      tone: 'success',
      message: 'Entrega en tránsito',
      icon: '✓',
    },
  ];

  constructor() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get('id') ?? 'ORD-000';
        this.orderId.set(id);

        this.orderService
          .trackOrderState()
          .pipe(takeUntil(this.destroy$))
          .subscribe((status) => {
            this.currentStatus.set(status);
          });
      });
  }

  get currentStepIndex(): number {
    const current = this.currentStatus();

    if (!current) {
      return 0;
    }

    return this.timeline.findIndex((step) => step.label === current.label);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
