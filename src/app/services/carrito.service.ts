// carrito.service.ts

import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Producto } from '../producto/model/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = []; // Arreglo para almacenar los productos en el carrito
  private total: number = 0; // Total acumulado
  private db: SQLiteObject;

  constructor(private dbService: SqliteService) { }

  // Método para agregar un producto al carrito en SQLite
 // Método para agregar un producto al carrito en SQLite
async addToCart(producto: Producto) {
  const db = await this.dbService.init();
  
  if (!db) {
    console.error('La base de datos no está inicializada.');
    return;
  }

  const result = await db.executeSql('SELECT * FROM cart WHERE id = ?', [producto.id]);
  
  if (result.rows.length > 0) {
    // Si el producto ya está en el carrito, incrementar la cantidad
    const existingProduct = result.rows.item(0);
    await db.executeSql('UPDATE cart SET cantidad = cantidad + 1 WHERE id = ?', [producto.id]);
  } else {
    // Si el producto no está en el carrito, insertarlo
    await db.executeSql('INSERT INTO cart (id, nombre, precio, cantidad, descripcion) VALUES (?, ?, ?, ?, ?)', 
                        [producto.id, producto.nombre, producto.precio, 1, producto.descripcion]);
  }
}

// Método para obtener los productos del carrito desde SQLite
async getCartItems() {
  const db = await this.dbService.init();
  
  if (!db) {
    console.error('La base de datos no está inicializada.');
    return [];
  }

  const result = await db.executeSql('SELECT * FROM cart', []);
  
  this.carrito = [];
  for (let i = 0; i < result.rows.length; i++) {
    this.carrito.push(result.rows.item(i));
  }

  return this.carrito;
}

// Método para eliminar productos del carrito
async removeFromCart(productId: number) {
  const db = await this.dbService.init();
  
  if (!db) {
    console.error('La base de datos no está inicializada.');
    return;
  }

  await db.executeSql('DELETE FROM cart WHERE id = ?', [productId]);
}

// Limpiar carrito
async clearCart() {
  const db = await this.dbService.init();
  
  if (!db) {
    console.error('La base de datos no está inicializada.');
    return;
  }

  await db.executeSql('DELETE FROM cart', []);
}

// Método para obtener el total
async getTotal() {
  const db = await this.dbService.init();
  
  if (!db) {
    console.error('La base de datos no está inicializada.');
    return 0;
  }

  const result = await db.executeSql('SELECT SUM(precio * cantidad) AS total FROM cart', []);
  return result.rows.item(0).total || 0;
}

}
