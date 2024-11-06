// list.page.ts
import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Producto } from 'src/app/services/sqlite.service';
import { ProductServiceService } from '../product-service.service';
import { Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})

export class ProductListPage implements OnInit {
  productos: Producto[] = [];
  private productSubscription: Subscription;

  constructor(private sqliteService: SqliteService, private productService: ProductServiceService, private router: Router) {
  }

  ngOnInit() {
    this.cargarProductos();
    //this.initJson();
  }

  cargarProductos() {
    this.sqliteService.products$.subscribe((productos) => {
        this.productos = productos;
    });
  }

  //initJson() {
  //  this.productService.getProducts().pipe(
  //    catchError((error: HttpErrorResponse) => {
  //      console.error('Error al obtener productos desde JSON server:', error.message);
  //      console.error('Detalles del error:', error); // Muestra el objeto completo
  //      return throwError(error); // Propaga el error
  //    })
  //  ).subscribe({
  //    next: (productosFromJson) => {
  //      this.productos = productosFromJson; // Carga productos desde JSON server
  //    },
  //    error: (error) => {
  //      console.error('Error al obtener productos desde JSON server:', error.message);
  //    },
  //    complete: () => {
  //      console.log('Carga de productos desde JSON server completada.');
  //    }
  //  });
  //}

  async eliminarProducto(productoId: string) {
    try {
      const response = await fetch(`https://f8ba-190-153-153-125.ngrok-free.app/productos/${productoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error en la eliminación del producto: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Producto eliminado del JSON Server:', result);
  
      await this.sqliteService.deleteProduct(productoId);
      console.log('Producto eliminado de SQLite');
  
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }
  


  editarProducto(nombre: string) {
    this.router.navigate(['/product-edit', nombre]);
  }
}
