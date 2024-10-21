import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage implements OnInit {

  nombreProducto: string;
  precio: number;
  descripcion: string;
  cantidad: number;

  constructor(
    private sqlite: SqliteService,
    private router: Router,
    private route: ActivatedRoute // Para obtener el parámetro de la ruta
  ) { }

  ngOnInit() {
    // Obtener parámetros de la ruta
    this.route.params.subscribe(params => {
      const nombre = params['nombre']; // Obtiene el nombre del producto de los parámetros
      this.cargarProducto(nombre); // Carga los datos del producto
    });

  }

  async cargarProducto(nombre: string) {
    const producto = await this.sqlite.selectDataByName(nombre); // Método para obtener el producto por nombre
    if (producto) {
      this.nombreProducto = producto.nombre;
      this.descripcion = producto.descripcion;
      this.precio = producto.precio;
      this.cantidad = producto.cantidad;
    }
  }

  async guardarCambios() {
    await this.sqlite.updateRecord(this.nombreProducto, this.descripcion, this.precio, this.cantidad);
    alert('Producto actualizado con éxito');
    this.router.navigate(['/product-list']); // Navega a la lista de productos
  }
}
