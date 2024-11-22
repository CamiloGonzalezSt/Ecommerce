import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private dbInstance!: SQLiteObject;

  constructor(private dbService: SqliteService) { 
    this.initializeDB();
  }
  
   // Inicializar la base de datos obteniendo la instancia desde SqliteService
   private async initializeDB() {
    try {
      this.dbInstance = await this.dbService.getDBInstance();
    } catch (error) {
      console.error('Error al inicializar la base de datos', error);
    }
  }

  async addToCart(product: any): Promise<{ success: boolean }> {
    try {
      // Verificar si el producto ya existe en el carrito
      const existingProduct = await this.dbInstance.executeSql(
        'SELECT * FROM cart WHERE product_id = ?', [product.id]
      );
  
      if (existingProduct.length > 0) {
        // Si el producto ya existe, solo actualizamos la cantidad
        await this.dbInstance.executeSql(
          'UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?', [product.id]
        );
      } else {
        // Si el producto no existe, lo agregamos al carrito
        await this.dbInstance.executeSql(
          'INSERT INTO cart (product_id, name, price, quantity) VALUES (?, ?, ?, ?)',
          [product.id, product.name, product.price, 1]
        );
      }
      return { success: true };  // Retornamos un objeto indicando éxito
    } catch (error) {
      console.error('Error al agregar al carrito', error);
      return { success: false };  // En caso de error, retornamos un objeto con éxito falso
    }
  }
  


  // Obtener los productos del carrito
  public async getCartItems(): Promise<any[]> {
    try {
      const result = await this.dbInstance.executeSql('SELECT * FROM cart', []);
      const cartItems = [];
      for (let i = 0; i < result.rows.length; i++) {
        cartItems.push(result.rows.item(i));
      }
      return cartItems;
    } catch (error) {
      console.error('Error al obtener productos del carrito', error);
      return [];
    }
  }

  // Eliminar un producto del carrito
  public async removeFromCart(productoId: number): Promise<any> {
    try {
      await this.dbInstance.executeSql('DELETE FROM cart WHERE productoId = ?', [productoId]);
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar producto del carrito', error);
      return { success: false, error };
    }
  }

  // Vaciar el carrito
  public async clearCart(): Promise<any> {
    try {
      await this.dbInstance.executeSql('DELETE FROM cart', []);
      return { success: true };
    } catch (error) {
      console.error('Error al vaciar el carrito', error);
      return { success: false, error };
    }
  }

  // Obtener el total del carrito (suma de precios)
  public async getCartTotal(): Promise<number> {
    try {
      const result = await this.dbInstance.executeSql('SELECT SUM(precio * cantidad) AS total FROM cart', []);
      if (result.rows.length > 0) {
        return result.rows.item(0).total;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error al calcular el total del carrito', error);
      return 0;
    }
  }
 
}
