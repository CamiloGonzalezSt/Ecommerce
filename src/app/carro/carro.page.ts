// carro.page.ts

import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { SqliteService } from '../services/sqlite.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-carro',
  templateUrl: './carro.page.html',
  styleUrls: ['./carro.page.scss'],
})
export class CarroPage implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(private cartService: CarritoService, private sqlite: SqliteService, private router: Router) { }

  ngOnInit() {
    this.loadCartItems();
  }

  // Cargar los productos del carrito desde la base de datos
  async loadCartItems() {
    this.cartItems = await this.cartService.getCartItems();
    this.calculateTotal();
  }

  // Calcular el total
  async calculateTotal() {
    this.total = await this.cartService.getTotal();
  }

  // Agregar un producto al carrito
  async addToCart(product: any) {
    try {
      await this.cartService.addToCart(product);
      this.loadCartItems(); // Recargar la lista del carrito
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  }

  // Eliminar un producto del carrito
  async removeFromCart(productId: number) {
    await this.cartService.removeFromCart(productId);
    this.loadCartItems(); // Actualizar la lista del carrito
  }

  // Vaciar el carrito
  async clearCart() {
    await this.cartService.clearCart();
    this.loadCartItems(); // Recargar el carrito después de vaciarlo
  }

  async comprar() {
    if (this.cartItems.length > 0) {
      const success = await this.sqlite.createOrder(this.total, this.cartItems);
      if (success) {
        await this.cartService.clearCart(); // Vaciar el carrito después de la compra
        this.loadCartItems(); // Recargar el carrito
        this.router.navigate(['/mis-pedidos']);
       
      }
    } else {
      alert('El carrito está vacío');
    }
  }
}
