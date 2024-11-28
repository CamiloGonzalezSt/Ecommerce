import { Injectable } from '@angular/core';
import { Producto } from '../producto/model/producto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiproductsService {

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  // Obtener todos los productos de Firestore
  getProducts(): Observable<Producto[]> {
    return this.firestore.collection<Producto>('productos').valueChanges(); // 'productos' es el nombre de la colección
  }

  addProduct(newProduct: Producto): Observable<Producto> {
    const productRef = this.firestore.collection('productos').add(newProduct);
    return from(productRef).pipe(
      map((docRef: any) => {
        return { ...newProduct, id: docRef.id };  // Añade el id del producto recién creado
      }),
      catchError((error) => {
        console.error('Error al agregar producto:', error);
        return throwError(error);
      })
    );
  }

  // Actualizar producto por ID
  updateProduct(id: number, updatedProduct: Producto) {
    const docRef = this.firestore.collection('productos').doc(id.toString()); // Asegúrate de que el ID sea de tipo string
    return docRef.update(updatedProduct); // Actualiza el documento con el ID correspondiente
  }
  

  // Eliminar producto por ID
  deleteProduct(id: number): Observable<void> {
    // Realiza una consulta para buscar el producto con el productoId numérico
    return from(
      this.firestore
        .collection('productos', ref => ref.where('id', '==', id))  // Busca productos por productoId
        .get()
    ).pipe(
      switchMap((querySnapshot) => {
        // Verifica si el producto existe en la base de datos
        if (!querySnapshot.empty) {
          // Si el producto existe, elimina el documento
          querySnapshot.forEach((doc) => {
            // Elimina el documento usando su id (que es generado automáticamente por Firebase)
            doc.ref.delete();
          });
          return of(undefined);  // Retorna Observable vacío al completar la eliminación
        } else {
          console.error('Producto no encontrado con id:', id);
          return throwError('Producto no encontrado');
        }
      }),
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        return throwError(error);  // Propaga el error como Observable
      })
    );
  }
  
}
