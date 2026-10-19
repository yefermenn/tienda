import { Routes } from '@angular/router';
import { BodegaComponent } from './components/bodega/bodega.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderTrackingComponent } from './components/order-tracking/order-tracking.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'configuracion',
    component: BodegaComponent,
  },
  {
    path: 'bodega',
    redirectTo: 'configuracion',
    pathMatch: 'full',
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'order-tracking/:id',
    component: OrderTrackingComponent,
  },
];
