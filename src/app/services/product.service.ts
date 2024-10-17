import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SqliteService } from './sqlite.service';
import { ClProducto } from '../producto/model/ClProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  //private apiUrl = 'http://localhost:3000/productos';
  private apiUrl = 'http://10.0.2.2:3000/productos';

  constructor(private http: HttpClient, private sqliteService: SqliteService) {

    
  }



  getProductos(): Observable<any> {
    return this.http.get(this.apiUrl);
  } 

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/${id}`);
  }

  async addProducto(product: ClProducto): Promise<void> {
    // Primero, se agrega a SQLite
    await this.sqliteService.addProduct(product);
    try {
      // Luego, se agrega a dbproducto.json
      await this.http.post(this.apiUrl, product).toPromise();
    } catch (error) {
      console.log('Error al agregar producto a dbproducto.json');
    }
   }


   async syncProductsWithJsonServer(): Promise<void> {
    try {
        // Obtener todos los productos de SQLite
        const productos = await this.sqliteService.getProducts();
        
        // Sincronizar con JSON Server
        for (const producto of productos) {
            await this.http.post(this.apiUrl, producto).toPromise();
        }
        console.log('Sincronización completa con JSON Server');
    } catch (error) {
        console.error('Error al sincronizar productos con JSON Server', error);
    } }

  

    async updateProducto(id: number, producto: ClProducto): Promise<void> {
      await this.sqliteService.updateProduct(id, producto); // Debes implementar este método en SqliteService
      await this.http.put(`${this.apiUrl}/${id}`, producto).toPromise();
  }
  
  async deleteProducto(id: number): Promise<void> {
      await this.sqliteService.deleteProduct(id); // Debes implementar este método en SqliteService
      await this.http.delete(`${this.apiUrl}/${id}`).toPromise();
  }
 
    
 }
