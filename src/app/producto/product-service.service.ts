import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Producto } from './model/producto';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  // Obtener todos los productos
  getProducts(): Observable<Producto[]> {
    return this.firestore.collection('productos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Producto;
        const id = Number(a.payload.doc.id); // Convertir el ID de Firestore a número
        return { ...data, id }; // Asignar el ID convertido al objeto Producto
      })),
      catchError((error) => {
        console.error('Error al obtener productos', error);
        return throwError(error);
      })
    );
  }
  
  
  

  // Agregar un nuevo producto
  addProduct(nombre: string, precio: number): Observable<Producto[]> {
    const newProduct: Producto = {
      nombre,
      precio,
      descripcion: '',
      cantidad: 0,
      imagen: '',
      categoria: '',
      id: 0
    };
  
    return from(this.firestore.collection('productos').add(newProduct)).pipe(
      switchMap(() => this.getProducts()), // Refresca la lista de productos
      catchError((error) => {
        console.error('Error al agregar producto', error);
        return throwError(error);
      })
    );
  }
  

  // Actualizar un solo producto por ID
  updateProduct(id: string, updatedProduct: Partial<Producto>): Observable<Producto[]> {
    return from(this.firestore.collection('productos').doc(id).update(updatedProduct)).pipe(
      switchMap(() => this.getProducts()), // Refresca la lista de productos
      catchError((error) => {
        console.error('Error al actualizar producto', error);
        return throwError(error);
      })
    );
  }
  


  // Eliminar un producto
  deleteProduct(id: string): Observable<Producto[]> {
    return from(this.firestore.collection('productos').doc(id).delete()).pipe(
      switchMap(() => this.getProducts()), // Refresca la lista de productos
      catchError((error) => {
        console.error('Error al eliminar producto', error);
        return throwError(error);
      })
    );
  }
  
}
