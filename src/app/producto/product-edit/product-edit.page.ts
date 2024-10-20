import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductServiceService } from '../product-service.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage implements OnInit {

  productForm: FormGroup;
  productId: any;

  // Injectamos librerías
  constructor(
    private formBuilder: FormBuilder,
    public restApi: ProductServiceService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private route: ActivatedRoute, 
    private sqlite: SqliteService, 
    private router: Router
  ) { 
    // Inicializar el formulario
    this.productForm = this.formBuilder.group({
      prod_name: ['', Validators.required],
      prod_desc: [''],
      prod_price: [null, [Validators.required, Validators.min(0)]],
      prod_cantidad: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    // Obtener los parámetros del producto
    this.route.paramMap.subscribe(params => {
      const nombreProducto = params.get('nombre');
      if (nombreProducto) {
        this.getProduct(nombreProducto); // Llama a getProduct para cargar los datos
      } else {
        console.error('El nombre del producto es nulo');
      }
    });
  }

  async getProduct(nombreProducto: string) {
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();

    this.restApi.getProducts().subscribe({
      next: (data) => {
        console.log("getProduct nombre data****", data);
        // Rescata los datos
        this.productForm.patchValue({
          prod_name: data.nombreProducto,
          prod_desc: data.descripcion,
          prod_price: data.precio,
          prod_cantidad: data.cantidad,
        });
        loading.dismiss();
      },
      error: async (err) => {
        console.log("getProductID Errr****", err);
        loading.dismiss();
        await this.presentAlert('Error al cargar el producto. Intente nuevamente.');
      }
    });
  }

  async saveChanges() {
    if (this.productForm.valid) {
      const { prod_name, prod_desc, prod_price, prod_cantidad } = this.productForm.value;
      try {
        await this.sqlite.updateRecord(prod_name, prod_desc, prod_price, prod_cantidad);
        this.router.navigate(['/product-list']); // Regresar a la lista de productos
      } catch (error) {
        console.error('Error al guardar cambios:', error);
        await this.presentAlert('Error al guardar cambios. Intente nuevamente.');
      }
    } else {
      console.error('No se puede guardar, hay campos vacíos');
      await this.presentAlert('Por favor, complete todos los campos.');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  async onFormSubmit() {
    if (this.productForm.valid) {
      const { prod_name, prod_desc, prod_price, prod_cantidad } = this.productForm.value;
      
      // Suponiendo que ya tienes el ID del producto para actualizar
      const productId = this.productId;  // Asegúrate de tener el ID del producto en tu componente
      const updatedProduct = {
        nombre: prod_name,
        descripcion: prod_desc,
        precio: prod_price,
        cantidad: prod_cantidad
      };
  
      try {
        // Esperar la respuesta de la actualización del producto
        const res = await lastValueFrom(this.restApi.updateProduct(productId, updatedProduct));
        
        // Suponiendo que la respuesta tiene un `id`
        const id = res['id'];  
        this.router.navigate(['/product-detail/', id]);  // Navegar a la página de detalles del producto
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
        await this.presentAlert('Error al actualizar el producto. Intente nuevamente.');
      }
    }
  }
   }
