import { Injectable } from '@angular/core';
import { Producto } from '../producto/model/producto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiproductsService {
  private apiUrl: string = 'https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54e'
  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    const headers = { '$2a$10$ojcKOiCAcMELufbBOq8j1erYzSBWTGT0it2D7I.rjsvPMIvBTlYz6': '$2a$10$Id8GoemldwMxOPpYiulLuuot2AonOfatAx5bJSGqXvjeDMUU/JbTK' }; // Agrega tu API Key
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map((response) => {
        console.log('Respuesta de la API:', response);
        return response.record.productos;
      })
    );
  }
  
}
