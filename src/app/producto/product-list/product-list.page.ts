import { Component, OnInit } from '@angular/core';
import { SqliteService, Producto } from 'src/app/services/sqlite.service';
import { ProductServiceService } from '../product-service.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  productos: Producto[] = []; // Inicializado como un array vacío

  constructor(
    private sqliteService: SqliteService, 
    private productService: ProductServiceService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos(); // Llama al método al cargar el componente
  }


async cargarProductos() {
  try {
    // Obtiene productos desde el JSON Server usando firstValueFrom
    const productosDesdeJson = await firstValueFrom(this.productService.getProducts());

    // Verifica si se obtuvieron productos y actualiza la lista de productos
    if (Array.isArray(productosDesdeJson)) {
      this.productos = productosDesdeJson;
      
      // Actualiza la lista de productos en SQLite
      for (const producto of this.productos) {
        await this.sqliteService.createProductInDb(producto);
      }

      // Actualiza el observable de productos en el servicio SQLite
      this.sqliteService.productsSubject.next(await this.sqliteService.getLocalProducts());
    } else {
      console.warn('No se obtuvieron productos válidos del JSON Server');
    }
    
  } catch (error) {
    console.error('Error al cargar productos:', error);
    alert('Error al cargar productos, por favor intenta nuevamente.');
  }
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
        alert('Error al eliminar el producto, por favor intenta nuevamente.');
      }
    }
  }

  editarProducto(productId: string) {
    this.router.navigate(['/product-edit', productId]); // Pasar solo el ID como parámetro
  }
}
