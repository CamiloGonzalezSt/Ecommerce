// src/app/carro/carro.page.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-carro',
  templateUrl: './carro.page.html',
  styleUrls: ['./carro.page.scss'],
})
export class CarroPage implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  constructor(private dbService: SqliteService, private cartService: CarritoService) {}

  ngOnInit() {
    this.loadCartItems();
  }

  
  // Cargar los productos del carrito desde la base de datos
  async loadCartItems() {
    this.cartItems = await this.cartService.getCartItems();
  }

  // Eliminar un producto del carrito
  async removeFromCart(productId: number) {
    await this.cartService.removeFromCart(productId);
    this.loadCartItems(); // Actualizar la lista del carrito
  }

  

  // Función para vaciar todo el carrito
  async clearCart() {
    await this.cartService.clearCart();
    this.loadCartItems(); // Recargar el carrito después de vaciarlo
  }
}
