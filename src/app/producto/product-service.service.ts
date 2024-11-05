import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { producto } from './model/ClProducto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  private apiUrl = environment.apiUrl; // URL base para el JSON Server

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProducts(): Observable<producto[]> {
    return this.http.get<producto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Agregar un nuevo producto
  addProduct(nombre: string, precio: number): Observable<producto> {
    const newProduct = {
      id: uuidv4(), // Genera un ID único
      nombre,
      precio
    };

    return this.http.post<producto>(`${this.apiUrl}/productos`, newProduct, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar producto
  updateProduct(id: string, productData: producto): Observable<producto> {
    return this.http.put<producto>(`${this.apiUrl}/${id}`, productData).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un producto por ID
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(`Error: ${error.message || error}`);
  }
}
