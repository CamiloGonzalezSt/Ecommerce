import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductServiceService } from '../product-service.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { SincronizarService } from 'src/app/services/sincronizar.service';
import { productos } from '../model/ClProducto';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  productos: productos[] = [];

  constructor(
    public restApi: ProductServiceService,
    public loadingController: LoadingController,
    public router: Router,
    private sqlite: SqliteService,
    private alertController: AlertController,
    private sincronizar: SincronizarService
  ) {}

  async ngOnInit() {
    await this.sqlite.createOpenDatabase();
    await this.sqlite.createTable();
    await this.syncProducts(); // Sincronizar al iniciar
  }

  async syncProducts() {
    await this.sincronizar.syncProducts();
    // Después de sincronizar, cargar los productos desde SQLite y JSON
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      // Cargar productos de SQLite
      const sqliteProducts = await this.sqlite.selectData();
      // Cargar productos de la API
      const jsonProducts = await this.getProductsFromApi();
      // Combinar y eliminar duplicados
      this.productos = this.mergeProducts(sqliteProducts, jsonProducts);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      // Manejo de error
    }
  }

  async getProductsFromApi() {
    return new Promise<productos[]>((resolve, reject) => {
      this.restApi.getProducts().subscribe({
        next: (res) => {
          console.log("Res:", res);
          resolve(res);
        },
        error: (err) => {
          console.error("Error:", err);
          reject(err);
        },
      });
    });
  }

  mergeProducts(sqliteProducts: productos[], jsonProducts: productos[]): productos[] {
    const combinedProducts = [...sqliteProducts, ...jsonProducts];
    // Eliminar duplicados basados en 'nombreProducto'
    const uniqueProducts = Array.from(new Map(combinedProducts.map(product => [product.nombreProducto, product])).values());
    return uniqueProducts;
  }

  async editProduct(producto: productos) {
    // Navegar a la página de edición, pasando el producto como parámetro
    this.router.navigate(['/product-edit', { nombre: producto.nombreProducto }]);
  }

  async deleteProduct(nombreProducto: string) {
    const loading = await this.loadingController.create({
      message: 'Eliminando...',
    });
    await loading.present();

    await this.sqlite.deleteRecord(nombreProducto); // Eliminar producto
    await this.loadProducts(); // Actualizar la lista de productos

    loading.dismiss();
  }
}
