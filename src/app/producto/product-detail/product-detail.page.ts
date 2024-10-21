import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

import { ProductServiceService } from '../product-service.service';
import { productos } from '../model/ClProducto';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  producto: productos = {
    nombreProducto: '',
    descripcion: '',
    precio: 0,
    cantidad: 0
  };

  constructor(
    public restApi: ProductServiceService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.getProduct();
  }

  async getProduct() {
    const productName = this.route.snapshot.paramMap.get('nombreProducto');
    console.log("nombre del producto recibido:", productName); // Verifica el ID recibido
    const loading = await this.loadingController.create({ message: 'Loading...' });
    await loading.present();
    await this.restApi.getProducts()
      .subscribe({
        next: (res) => {
          console.log("Datos del producto:", res); // Verifica los datos recibidos
          this.producto = res;
          loading.dismiss();
        },
        error: (err) => {
          console.log("Error en getProduct:", err); // Verifica si hay algún error
          loading.dismiss();
        }
      });
  }

  async delete(nombreProducto: string) {
    this.presentAlertConfirm(nombreProducto, 'Confirme la Eliminación, De lo contrario Cancele');
  }

  async presentAlertConfirm(nombreProducto: string, msg: string) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: msg,
      buttons: [
        {
          text: 'Eliminar : ' + nombreProducto + " OK",
          handler: () => {
            this.deleteConfirmado(nombreProducto);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteConfirmado(nombreProducto: string) {
    alert("Eliminando " + nombreProducto);
    const loading = await this.loadingController.create({ message: 'Loading...' });
    await loading.present();
    await this.restApi.deleteProduct( nombreProducto )
      .subscribe({
        next: (res) => {
          console.log("Producto eliminado:", res);
          loading.dismiss();
          this.router.navigate(['/product-list']);
        },
        error: (err) => {
          console.log("Error en eliminar el producto:", err);
          loading.dismiss();
        }
      });
  }
}
