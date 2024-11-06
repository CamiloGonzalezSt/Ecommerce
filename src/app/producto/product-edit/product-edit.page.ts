import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductServiceService } from '../product-service.service';
import { producto } from '../model/ClProducto';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage implements OnInit {
  id: string; // ID del producto como string
  nombre: string;
  precio: number;
  descripcion: string;
  cantidad: number;

  constructor(
    private sqlite: SqliteService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductServiceService // Inyecta el servicio de productos
  ) {}

  ngOnInit() {
    // Obtenemos el ID del producto desde los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id']; // Mantener como string
      this.cargarProducto(this.id); // Carga el producto usando el ID
    });
  }

  async cargarProducto(id: string) { 
      const productos: producto[] = await this.productService.getProducts().toPromise() || [];
      const productoEncontrado = productos.find(p => p.id === id); 
      
      if (productoEncontrado) {
        this.nombre = productoEncontrado.nombre;
        this.descripcion = productoEncontrado.descripcion;
        this.precio = productoEncontrado.precio;
        this.cantidad = productoEncontrado.cantidad;
      } else {
        console.error('Producto no encontrado');
      }
    
  }
  
  

  async guardarCambios() {
    const updatedProduct: producto = {
      id: this.id, // Asegúrate de que `id` es number
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      cantidad: this.cantidad
    };
  
    try {
      // Actualiza primero en SQLite
      await this.sqlite.updateProduct(updatedProduct);
  
      // Luego, actualiza en JSON Server
      await this.productService.updateProduct(this.id, updatedProduct).toPromise();
      alert('Producto actualizado con éxito');
      this.router.navigate(['/product-list']);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto: ' + error);
    }
  }
  
}
