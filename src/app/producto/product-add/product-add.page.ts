// add.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Producto } from 'src/app/services/sqlite.service'


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage  {
  producto: Producto = {
    id: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0
  };

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async agregarProducto() {
    if (this.producto.nombre && this.producto.descripcion && this.producto.precio && this.producto.cantidad) {
      try {
        await this.sqliteService.createProduct(this.producto);
        alert('Producto agregado exitosamente');
        //this.router.navigate(['/product-list']); // Navega a la página de lista después de agregar
      } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto');
      }
    } else {
      alert('Por favor, complete todos los campos');
    }
  }
}
