import { Injectable } from '@angular/core';
import { concat, interval, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OrderStatus } from '../models/order-status';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly stages: OrderStatus[] = [
    {
      label: 'Esperando',
      tone: 'neutral',
      message: 'Tu pedido está pendiente de ser confirmado.',
      icon: '⏳',
    },
    {
      label: 'Esperando confirmación',
      tone: 'warning',
      message: 'Estamos validando tu pago y la preparación del pedido.',
      icon: '🕒',
    },
    {
      label: 'Preparando pedido',
      tone: 'info',
      message: 'El pedido ya está siendo empaquetado y listo para salir.',
      icon: '📦',
    },
    {
      label: 'En camino',
      tone: 'success',
      message: 'Tu compra está en tránsito y llegará pronto.',
      icon: '✓',
    },
  ];

  createOrder(): string {
    return `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }

  trackOrderState(): Observable<OrderStatus> {
    return concat(
      of(this.stages[0]),
      interval(10000).pipe(
        map((tick) => this.stages[Math.min(tick + 1, this.stages.length - 1)]),
        take(this.stages.length - 1),
      ),
    );
  }
}
