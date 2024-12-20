import { Component, OnInit, OnDestroy } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { ProductServiceService } from '../product-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiproductsService } from 'src/app/services/apiproducts.service';
import { Producto } from '../model/producto';



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
    private router: Router,
    private apiproducts: ApiproductsService
  ) {
    
  }
  

  ngOnInit() {
    // Suscripción inicial a los cambios de productos
    this.productSubscription = this.sqliteService.products$.subscribe(
      (productos) => {
        this.productos = productos;
      }
    );
  }

  ionViewWillEnter() {
    // Cargar productos cada vez que se muestra la página
    this.cargarProducto();
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  cargarProducto() {
    this.apiproducts.getProducts().subscribe({
      next: (productos) => {
        this.productos = productos; // Actualiza la lista de productos
        console.log('Productos cargados desde la API:', this.productos);
      },
      error: (err) => {
        console.error('Error al cargar productos desde la API:', err);
      },
    });
  }
  

  async cargarProductos() {
    try {
      console.log('Cargando productos desde el servidor y SQLite...');
      const localProducts = await this.sqliteService.getLocalProducts();
      const serverProducts = await this.sqliteService.getProductsFromServer();
  
      console.log('Productos locales:', localProducts);
      console.log('Productos del servidor:', serverProducts);
  
      // Filtrar productos del servidor que no estén en SQLite
      const newProducts = serverProducts.filter(
        (serverProduct) =>
          !localProducts.some((localProduct) => localProduct.id === serverProduct.id)
      );
  
      // Insertar los productos nuevos en SQLite
      for (const product of newProducts) {
        await this.sqliteService.createProductInDb(product);
      }
  
      // Actualizar la lista de productos
      this.productos = [...localProducts, ...newProducts];
      console.log('Productos sincronizados:', this.productos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }
  

  onDeleteProduct(productId: number) {
    this.apiproducts.deleteProduct(productId).subscribe({
      next: () => {
        console.log('Producto eliminado correctamente');
        this.cargarProducto();  // Recargar productos o actualizar la vista
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
      }
    });
  }
     
  editarProducto(id: number) {
    this.router.navigate(['/product-edit', id]);
  }
}
