import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Producto } from './model/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  private apiUrl = 'https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54e'; // URL del JSON bin
  private apiKey = '$2a$10$ojcKOiCAcMELufbBOq8j1erYzSBWTGT0it2D7I.rjsvPMIvBTlYz6'; // Reemplaza con tu clave de API

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProducts(): Observable<Producto[]> {
    return this.http
      .get<any>(this.apiUrl, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Master-Key': this.apiKey,
        }),
      })
      .pipe(
        map((response) => response.record), // `record` contiene los datos reales
        catchError((error) => {
          console.error('Error al obtener productos', error);
          return throwError(error); // Propaga el error
        })
      );
  }

  // Agregar un nuevo producto
  addProduct(nombre: string, precio: number): Observable<Producto[]> {
    return this.getProducts().pipe(
      switchMap((productos) => {
        const newProduct: Producto = {
          id: productos.length ? productos[productos.length - 1].id + 1 : 1, // Genera un nuevo ID
          nombre,
          precio,
          descripcion: '',
          cantidad: 0,
          imagen: '',
          categoria: '',
        };
        productos.push(newProduct); // Agrega el nuevo producto
        return this.updateBin(productos); // Actualiza el bin completo
      }),
      catchError((error) => {
        console.error('Error al agregar producto', error);
        return throwError(error);
      })
    );
  }

  // Actualizar un solo producto por ID
  updateProduct(id: number, updatedProduct: Partial<Producto>): Observable<Producto[]> {
    return this.getProducts().pipe(
      switchMap((productos) => {
        const index = productos.findIndex((producto) => producto.id === id); // Encuentra el índice del producto
        if (index === -1) {
          throw new Error(`Producto con ID ${id} no encontrado`);
        }
        // Actualiza solo los campos proporcionados
        productos[index] = { ...productos[index], ...updatedProduct };
        return this.updateBin(productos); // Actualiza el bin completo
      }),
      catchError((error) => {
        console.error('Error al actualizar producto', error);
        return throwError(error);
      })
    );
  }

  // Actualizar el JSON bin completo
  private updateBin(productos: Producto[]): Observable<Producto[]> {
    return this.http
      .put<any>(
        this.apiUrl,
        { record: productos }, // Sobrescribe el bin completo
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Master-Key': this.apiKey,
          }),
        }
      )
      .pipe(
        map((response) => response.record), // Devuelve los datos actualizados
        catchError((error) => {
          console.error('Error al actualizar bin', error);
          return throwError(error);
        })
      );
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<Producto[]> {
    return this.getProducts().pipe(
      switchMap((productos) => {
        const productosActualizados = productos.filter(
          (producto) => producto.id !== id
        ); // Filtra los productos
        return this.updateBin(productosActualizados); // Actualiza el bin completo
      }),
      catchError((error) => {
        console.error('Error al eliminar producto', error);
        return throwError(error);
      })
    );
  }
}
