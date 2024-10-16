import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SqliteService } from './sqlite.service';
import { ClProducto } from '../producto/model/ClProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/productos';

  constructor(private http: HttpClient, private sqliteService: SqliteService) {}

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  async addProducto(product: ClProducto): Promise<void> {
    // Primero, se agrega a SQLite
    await this.sqliteService.addProduct(product);

    // Luego, se agrega a dbproducto.json
    await this.http.post<ClProducto>(this.apiUrl, product).toPromise();
  }
  

  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
