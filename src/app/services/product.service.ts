import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SqliteService } from './sqlite.service';
import { productos } from '../producto/model/ClProducto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient, private sqliteService: SqliteService) {}

  // Sincronización de productos entre SQLite y JSON Server
  async syncProductsWithJsonServer(): Promise<void> {
    try {
      // Obtener todos los productos de SQLite
      const productos = await this.sqliteService.selectData();
      
      // Obtener productos del servidor JSON
      const productosServer = await this.http.get<productos[]>(this.apiUrl).toPromise();
      
      // Verificar si productosServer es indefinido o nulo
      if (!productosServer) {
        console.error('No se pudieron obtener los productos del servidor.');
        return;
      }
  
      // Sincronizar cada producto de SQLite con el servidor
      for (const producto of productos) {
        const existsInServer = productosServer.find((p) => p.nombreProducto === producto.nombreProducto);
        
        // Si el producto no existe en el servidor, agregarlo
        if (!existsInServer) {
          await this.http.post(this.apiUrl, producto).toPromise();
        }
      }
      console.log('Sincronización completa con JSON Server');
    } catch (error) {
      console.error('Error al sincronizar productos con JSON Server', error);
    }
  }

  // Obtener productos desde JSON Server
  getProductos(): Observable<productos[]> {
    return this.http.get<productos[]>(this.apiUrl);
  }

  // Agregar producto al servidor y SQLite
  async addProducto(product: productos): Promise<void> {
    try {
      // Agregar al servidor
      await this.http.post(this.apiUrl, product).toPromise();
      // También agregar a SQLite
      await this.sqliteService.insertData(
        product.nombreProducto,
        product.descripcion,
        product.precio,
        product.cantidad
      );
    } catch (error) {
      console.error('Error al agregar producto', error);
    }
  }

  // Actualizar producto en el servidor y SQLite
  async updateProducto(product: productos): Promise<void> {
    try {
      // Actualizar en el servidor
      await this.http.put(`${this.apiUrl}/${product.nombreProducto}`, product).toPromise();
      // Actualizar en SQLite
      await this.sqliteService.updateRecord(
        product.nombreProducto,
        product.descripcion,
        product.precio,
        product.cantidad
      );
    } catch (error) {
      console.error('Error al actualizar producto', error);
    }
  }

  // Eliminar producto del servidor y SQLite
  async deleteProducto(nombreProducto: string): Promise<void> {
    try {
      // Eliminar del servidor
      await this.http.delete(`${this.apiUrl}/${nombreProducto}`).toPromise();
      // Eliminar de SQLite
      await this.sqliteService.deleteRecord(nombreProducto);
    } catch (error) {
      console.error('Error al eliminar producto', error);
    }
  }
}
