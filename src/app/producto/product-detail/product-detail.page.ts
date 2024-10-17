import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { ClProducto } from '../model/ClProducto';
import { ProductServiceService } from '../product-service.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  producto: ClProducto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    fecha: new Date(),
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
    const productId = this.route.snapshot.paramMap.get('id');
    console.log("ID del producto recibido:", productId); // Verifica el ID recibido
    const loading = await this.loadingController.create({ message: 'Loading...' });
    await loading.present();
    await this.restApi.getProduct(productId!)
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

  async delete(id: number) {
    this.presentAlertConfirm(id, 'Confirme la Eliminación, De lo contrario Cancele');
  }

  async presentAlertConfirm(id: number, msg: string) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: msg,
      buttons: [
        {
          text: 'Eliminar : ' + id + " OK",
          handler: () => {
            this.deleteConfirmado(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteConfirmado(id: number) {
    alert("Eliminando " + id);
    const loading = await this.loadingController.create({ message: 'Loading...' });
    await loading.present();
    await this.restApi.deleteProduct(id)
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
