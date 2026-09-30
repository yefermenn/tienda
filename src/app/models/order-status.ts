export type OrderStage =
  | 'Esperando'
  | 'Esperando confirmación'
  | 'Preparando pedido'
  | 'En camino';

export interface OrderStatus {
  label: OrderStage;
  tone: 'neutral' | 'warning' | 'info' | 'success';
  message: string;
  icon: string;
}
