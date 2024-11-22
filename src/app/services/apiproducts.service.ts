import { Injectable } from '@angular/core';
import { Producto } from '../producto/model/producto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiproductsService {
  private apiUrl = 'https://1848-190-215-154-112.ngrok-free.app/productos'
  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> { // Asegúrate de que la función devuelva un array de Producto
    return this.http.get<Producto[]>(this.apiUrl); // Llama a la API y devuelve un array de productos
  }
}
