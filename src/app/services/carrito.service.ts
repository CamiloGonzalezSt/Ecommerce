import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartKey = 'cart';

  private dbInstance!: SQLiteObject;

  constructor(private dbService: SqliteService) { 
    this.initializeDB();

  }

  
  
   // Inicializar la base de datos obteniendo la instancia desde SqliteService
   private async initializeDB() {
    try {
      this.dbInstance = await this.dbService.getDBInstance();
      await this.dbService.createTable();
    } catch (error) {
      console.error('Error al inicializar la base de datos', error);
    }
  }

  // Ejemplo de servicio
  addToCart(product: { id: number; name: string; price: number; cantidad: number }) {
    return new Promise<{ success: boolean }>(async (resolve, reject) => {
      try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54ecart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
        if (response.ok) {
          resolve({ success: true });
        } else {
          reject('Error al agregar al carrito');
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  

  


  // Obtener los productos del carrito
  public async getCartItems(): Promise<any[]> {
    try {
      const response = await fetch('https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54ecart');
      if (response.ok) {
        const cartItems = await response.json();
        return cartItems;
      } else {
        console.error('Error al obtener los productos del carrito');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los productos del carrito:', error);
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
