import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  private apiUrl = "http://192.168.4.97:3000/productos";

  constructor(private http: HttpClient) {}

  // Obtener todos los productos del servidor
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  // Obtener un producto por ID
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Agregar un nuevo producto
  addProduct(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Eliminar un producto del servidor
  deleteProduct(nombre: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${nombre}`).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un producto
  updateProduct(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ha ocurrido un error:', error);
    return throwError(error);
  }
}
