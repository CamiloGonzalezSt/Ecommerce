import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { AlertController } from '@ionic/angular'; // Importar AlertController
import { productos } from '../model/ClProducto';
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit {
  id: number;
  nombreProducto: string;
  precio: number;
  descripcion:  string;
  cantidad: number;

  producto: productos []=[];

  constructor(
   private sqlite: SqliteService,
   private alertController: AlertController
    ) {}

  async ngOnInit() {
    this.sqlite.createOpenDatabase();
    this.sqlite.createTable();
    this.producto = await this.sqlite.selectData(); // Cargar los productos
  }

  // Insertar un nuevo producto
  async addProduct() {
    try {
      await this.sqlite.insertData(this.nombreProducto, this.descripcion, this.precio, this.cantidad);
      this.producto = await this.sqlite.selectData(); // Actualizar lista de productos
      this.presentAlert('Éxito', 'El producto ha sido agregado con éxito.'); // Mostrar alerta de éxito
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      this.presentAlert('Error', 'No se pudo agregar el producto.'); // Mostrar alerta de error
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
    await this.sqlite.deleteRecord(nombreProducto);
    this.producto = await this.sqlite.selectData(); // Actualizar lista de productos
  }

  // Actualizar un producto
  async updateProduct() {
    await this.sqlite.updateRecord(this.nombreProducto, this.descripcion, this.precio, this.cantidad);
    this.producto = await this.sqlite.selectData(); // Actualizar lista de productos
  }

  async seeProduct(){
    this.sqlite.selectData().then(data => console.log(data));
  }

  
}
  
 


