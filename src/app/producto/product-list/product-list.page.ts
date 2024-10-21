import { Component, OnInit, OnDestroy } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit, OnDestroy {
  productos: Producto[] = []; // Cambia 'productos' a 'Producto'
  private productosSubscription: Subscription;

  constructor(private sqlite: SqliteService, private router: Router) {}

  ngOnInit() {
    this.productosSubscription = this.sqlite.productos$.subscribe((data: Producto[]) => {
      // Utiliza un Set para eliminar duplicados y filtra los elementos undefined
      const uniqueProductNames = Array.from(new Set(data.map(a => a.nombre)));
      this.productos = uniqueProductNames
        .map(nombre => data.find(a => a.nombre === nombre))
        .filter((producto): producto is Producto => producto !== undefined); // Filtra 'undefined'

      console.log('Productos en la lista:', this.productos);
    });

    this.cargarProductos(); // Cargar productos al iniciar el componente
  }

  ngOnDestroy() {
    if (this.productosSubscription) {
      this.productosSubscription.unsubscribe(); // Desuscribirse al destruir el componente
    }
  }

  ionViewWillEnter() {
    this.cargarProductos(); // Recargar productos al entrar en la vista
  }

  async cargarProductos() {
    await this.sqlite.selectData();
  }

  // Método para eliminar un producto
  async eliminarProducto(nombre: string) {
    try {
      await this.sqlite.deleteRecord(nombre);
      alert('Producto eliminado con éxito');
      this.cargarProductos();  // Recargar la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar el producto', error);
    }
  }

  // Método para editar un producto
  async editarProducto(producto: Producto) { // Cambia 'productos' a 'Producto'
    this.router.navigate(['/product-edit', producto.nombre]);
    alert(`Editar producto: ${producto.nombre}`);
  }
}

// Cambia el nombre de 'productos' a 'Producto'
export class Producto {
  public nombre: string;
  public descripcion: string; 
  public precio: number;
  public cantidad: number;
}
