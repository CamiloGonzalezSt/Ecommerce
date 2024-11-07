// list.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Producto } from 'src/app/services/sqlite.service';
import { ProductServiceService } from '../product-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit, OnDestroy {
  productos: Producto[] = [];
  private productSubscription: Subscription;

  constructor(
    private sqliteService: SqliteService,
    private productService: ProductServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.productSubscription = this.sqliteService.products$.subscribe(
      (productos) => {
        this.productos = productos;
      }
    );
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  async cargarProductos() {
    try {
      const localProducts = await this.sqliteService.getLocalProducts();
      
      const serverProducts = await this.sqliteService.getProductsFromServer();

      // Filtrar productos del servidor que no estén en la base de datos local
      const newProducts = serverProducts.filter(
        (serverProduct) => !localProducts.some(localProduct => localProduct.id === serverProduct.id)
      );

      // Insertar los productos nuevos en la base de datos local
      for (const product of newProducts) {
        await this.sqliteService.createProductInDb(product);
      }

      // Actualizar la lista de productos en el componente directamente
      this.productos = [...localProducts, ...newProducts];
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  async eliminarProducto(productoId: string) {
    try {
      // Eliminar producto del JSON Server
      const response = await fetch(`https://f8ba-190-153-153-125.ngrok-free.app/productos/${productoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la eliminación del producto: ${response.statusText}`);
      }

      // Eliminar producto de SQLite
      await this.sqliteService.deleteProduct(productoId);
      console.log('Producto eliminado de SQLite y JSON Server');

      // Recargar la lista de productos después de la eliminación
      this.cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }

  editarProducto(nombre: string) {
    this.router.navigate(['/product-edit', nombre]);
  }
}
