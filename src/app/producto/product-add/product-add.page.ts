import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClProducto } from '../model/ClProducto';
import { ProductServiceService } from '../product-service.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit {
  productForm!: FormGroup;

  // Definimos la propiedad producto aquí
  producto: ClProducto = {
    id: 0, // Este valor se reemplazará cuando se agregue el producto
    nombre: '',
    descripcion: '',
    precio: 0,
    fecha: new Date(),
    cantidad: 0
  };

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private restApi: ProductServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      prod_name: [null, Validators.required],
      prod_desc: [null, Validators.required],
      prod_price: [null, Validators.required],
      prod_cantidad: [null, Validators.required],
    });
  }

  async onFormSubmit(form: NgForm) {
    console.log("onFormSubmit del Product ADD");

    // Creamos un Loading Controller
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();

    // Actualiza la propiedad producto con los valores del formulario
    this.producto.id = this.generateId(); // Llama a la función para generar un nuevo ID
    this.producto.nombre = this.productForm.value.prod_name;
    this.producto.descripcion = this.productForm.value.prod_desc;
    this.producto.precio = this.productForm.value.prod_price;
    this.producto.cantidad = this.productForm.value.prod_cantidad;

    // Ejecuta el método del servicio y los suscribe
    await this.restApi.addProduct(this.producto)
      .subscribe({
        next: (res) => {
          console.log("Next AddProduct Page", res);
          loading.dismiss(); // Elimina la espera
          if (res == null) { // No viene respuesta del registro
            console.log("Next No Agrego, Ress Null ");
            return;
          }
          // Si viene respuesta
          console.log("Next Agrego SIIIIII Router saltaré ;", this.router);
          this.router.navigate(['/product-list']);
        },
        complete: () => {},
        error: (err) => {
          console.log("Error AddProduct Página", err);
          loading.dismiss(); // Elimina la espera
        }
      });
    console.log("Observe que todo lo del suscribe sale después de este mensaje");
  }

  // Método para generar un ID único
  private generateId(): number {
    return Math.floor(Math.random() * 10000); // Genera un ID aleatorio entre 0 y 9999
  }
}
