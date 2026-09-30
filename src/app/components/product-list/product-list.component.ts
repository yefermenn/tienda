import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

const mockProducts: Product[] = [
  {
    id: 1,
    nombre: 'Auriculares Studio Pro',
    precio: 189.99,
    imagen:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    ],
    descripcion: 'Audio premium con cancelación activa y batería de 30 horas.',
  },
  {
    id: 2,
    nombre: 'Smartwatch Urban X',
    precio: 249.99,
    imagen:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=80',
    ],
    descripcion: 'Monitoreo deportivo, GPS y diseño elegante para uso diario.',
  },
  {
    id: 3,
    nombre: 'Laptop Aero 14',
    precio: 999.0,
    imagen:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
    ],
    descripcion: 'Portátil ultraligera, potente y lista para trabajo o estudio.',
  },
  {
    id: 4,
    nombre: 'Cámara Lumina 4K',
    precio: 629.99,
    imagen:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    ],
    descripcion: 'Captura fotos nítidas con video 4K y zoom óptico de alta calidad.',
  },
  {
    id: 5,
    nombre: 'Altavoz Pulse Mini',
    precio: 89.5,
    imagen:
      'https://images.unsplash.com/photo-1545852520-8cf7e7d68d93?auto=format&fit=crop&w=900&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1545852520-8cf7e7d68d93?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
    ],
    descripcion: 'Sonido profundo con conexión Bluetooth y resistencia IPX5.',
  },
  {
    id: 6,
    nombre: 'Mochila Travel Flex',
    precio: 119.0,
    imagen:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    ],
    descripcion: 'Diseño ergonómico y compartimentos inteligentes para moverse.',
  },
];

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  private readonly cartService = inject(CartService);

  readonly products = mockProducts;
  readonly cartItems = this.cartService.items;
  readonly selectedProduct = signal<Product | null>(null);
  readonly selectedImageIndex = signal(0);

  isProductInCart(productId: number): boolean {
    return this.cartItems().some((item) => item.id === productId);
  }

  openProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedImageIndex.set(0);
  }

  closeProduct(): void {
    this.selectedProduct.set(null);
    this.selectedImageIndex.set(0);
  }

  selectImage(index: number): void {
    const gallery = this.selectedProduct()?.galeria ?? [this.selectedProduct()?.imagen ?? ''];

    if (index >= 0 && index < gallery.length) {
      this.selectedImageIndex.set(index);
    }
  }

  addToCart(product: Product): void {
    if (this.isProductInCart(product.id)) {
      return;
    }

    this.cartService.addToCart(product);
  }

  onCardKeydown(event: KeyboardEvent, product: Product): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openProduct(product);
    }
  }
}
