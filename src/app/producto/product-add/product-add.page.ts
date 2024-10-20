import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { AlertController } from '@ionic/angular';
import { productos } from '../model/ClProducto';
import { ProductoService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit {
  producto: productos = {
    nombreProducto: '',
    precio: 0,
    descripcion: '',
    cantidad: 0
  };

  constructor(
    private sqlite: SqliteService,
    private alertController: AlertController,
    private productoService: ProductoService
  ) {
    this.sqlite.createOpenDatabase().then(() => {
      console.log('Base de datos lista para usarse');
    }).catch(error => {
      console.error('Error al inicializar la base de datos', error);
    });
  }

  async ngOnInit() {
    this.sqlite.createOpenDatabase();
    this.sqlite.createTable();
  }

  // Insertar un nuevo producto
  async addProduct() {
    try {
      await this.productoService.addProducto(this.producto);
      console.log('Producto agregado con éxito');
      // Mostrar alerta de éxito
      await this.presentAlert('Éxito', 'Producto agregado con éxito.');
      // Reiniciar el formulario
      this.resetForm();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      await this.presentAlert('Error', 'No se pudo agregar el producto.');
    }
  }

  // Mostrar alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Eliminar un producto
  async deleteProduct(nombreProducto: string) {
    try {
      await this.sqlite.deleteRecord(nombreProducto);
      console.log('Producto eliminado con éxito');
      await this.presentAlert('Éxito', 'Producto eliminado con éxito.');
      // Puedes actualizar la lista de productos aquí si es necesario
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      await this.presentAlert('Error', 'No se pudo eliminar el producto.');
    }
  }

  // Actualizar un producto
  async updateProduct() {
    try {
      await this.sqlite.updateRecord(this.producto.nombreProducto, this.producto.descripcion, this.producto.precio, this.producto.cantidad);
      console.log('Producto actualizado con éxito');
      await this.presentAlert('Éxito', 'Producto actualizado con éxito.');
      // Puedes actualizar la lista de productos aquí si es necesario
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      await this.presentAlert('Error', 'No se pudo actualizar el producto.');
    }
  }

  // Reiniciar el formulario
  resetForm() {
    this.producto = {
      nombreProducto: '',
      precio: 0,
      descripcion: '',
      cantidad: 0
    };
  }

  // Ver productos
  async seeProduct() {
    this.sqlite.selectData().then(data => console.log(data));
  }
}
