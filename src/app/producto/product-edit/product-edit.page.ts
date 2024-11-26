import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductServiceService } from '../product-service.service';
import { Producto } from '../model/producto'; 

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage implements OnInit {
  id: number; // Asegúrate de que `id` es de tipo `number`
  nombre: string;
  precio: number;
  descripcion: string;
  cantidad: number;
  imagen: string;
  categoria: string;

  constructor(
    private sqlite: SqliteService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductServiceService // Inyecta el servicio de productos
  ) {}

  ngOnInit() {
    // Obtenemos el ID del producto desde los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = +params['id']; // Convertir a número con "+"
      this.cargarProducto(this.id); // Carga el producto usando el ID
    });
  }

  async cargarProducto(id: number) { 
    const productos: Producto[] = await this.productService.getProducts().toPromise() || [];
    const productoEncontrado = productos.find(p => p.id === id); 
    
    if (productoEncontrado) {
      this.nombre = productoEncontrado.nombre;
      this.descripcion = productoEncontrado.descripcion;
      this.precio = productoEncontrado.precio;
      this.cantidad = productoEncontrado.cantidad;
      this.imagen = productoEncontrado.imagen;
      this.categoria = productoEncontrado.categoria;
    } else {
      console.error('Producto no encontrado');
    }
  }

  async guardarCambios() {
    const updatedProduct: Producto = {  // Asegúrate de usar el tipo correcto
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      cantidad: this.cantidad,
      imagen: this.imagen,
      categoria: this.categoria
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
