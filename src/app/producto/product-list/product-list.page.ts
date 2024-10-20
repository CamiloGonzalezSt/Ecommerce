import { Component, OnInit } from '@angular/core';
// Importamos Librerías
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
  // Creamos la Variable para el Html
  productos: productos[] = []; // Cambia 'producto' a 'productos' para reflejar que es un array

  // Injectamos Librerías
  constructor(
    public restApi: ProductServiceService,
    public loadingController: LoadingController,
    public router: Router,
    private sqlite: SqliteService,
    private alertController: AlertController,
    private sincronizar: SincronizarService
  ) {}

  // LLamamos al método que rescata los productos  
  async ngOnInit() {
    await this.sqlite.createOpenDatabase();
    await this.sqlite.createTable();
    await this.syncProducts(); // Sincronizar al iniciar
  }

  async syncProducts() {
    await this.sincronizar.syncProducts();
    // Después de sincronizar, cargar los productos desde SQLite para mostrarlos
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      // Cargar los productos desde SQLite
      this.productos =  await this.sqlite.selectData();
    } catch (error) {
      console.error('Error al cargar los productos desde SQLite:', error);
      // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  }

  // Método que rescata los productos desde el servidor
  async getProducts() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    this.restApi.getProducts().subscribe({
      next: (res) => { 
        console.log("Res:", res);
        this.productos = res; // Asignar el resultado al arreglo productos
        loading.dismiss();
      },
      error: (err) => {
        console.error("Error:", err);
        loading.dismiss();
      },
    });
  }

  // Método para listar los productos desde SQLite
  async listProducts() {
    this.productos = await this.sqlite.selectData(); // Obtener productos desde la base de datos
    console.log('Lista de productos:', this.productos); // Mostrar en la consola
  }

  async seeProduct() {
    this.sqlite.selectData().then(data => console.log(data));
  }

  // Método para modificar un producto
  async editProduct(producto: productos) {
    // Navegar a la página de edición, pasando el producto como parámetro
    this.router.navigate(['/product-edit', { nombre: producto.nombreProducto }]);
  }

  // Método para eliminar un producto
  async deleteProduct(nombreProducto: string) {
    const loading = await this.loadingController.create({
      message: 'Eliminando...',
    });
    await loading.present();

    await this.sqlite.deleteRecord(nombreProducto); // Eliminar producto
    await this.listProducts(); // Actualizar la lista de productos

    loading.dismiss();
  }
}
