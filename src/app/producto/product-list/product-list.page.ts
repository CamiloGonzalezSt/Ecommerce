// list.page.ts
import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Producto } from 'src/app/services/sqlite.service';
import { ProductServiceService } from '../product-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})

export class ProductListPage implements OnInit {
  productos: Producto[] = [];

  constructor(private sqliteService: SqliteService, private productService: ProductServiceService, private router: Router) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.sqliteService.products$.subscribe((productos) => {
      this.productos = productos;
    });
  }

  async eliminarProducto(productId: string) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        // Primero, elimina el producto de SQLite
        await this.sqliteService.deleteProduct(productId);
        
        // Luego, elimina el producto de JSON Server
        await this.productService.deleteProduct(productId).toPromise();
        
        alert('Producto eliminado');
        this.cargarProductos(); // Recargar la lista de productos
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  }

  editarProducto(productId: string) {
    this.router.navigate(['/product-edit', productId]); // Pasar solo el ID como parámetro
  }
}
