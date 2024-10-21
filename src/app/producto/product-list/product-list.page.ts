import { Component, OnInit } from '@angular/core';
import { SqliteService, productos } from 'src/app/services/sqlite.service';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  productos: productos[]= [];
 
  constructor(private sqlite: SqliteService) { }
 
  // LLamamos al método que rescata los productos  
  ngOnInit() {
    this.sqlite.createOpenDatabase().then(()=>{
      this.cargarProductos();
    });
  }
  
  ionViewDidEnter() {
    this.cargarProductos();
  }

  async cargarProductos() {
    this.sqlite.selectData()
    .then((productos) => {
      this.productos = productos;
    });
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
async editarProducto(producto: productos) {
  // Aquí puedes redirigir a una página de edición o abrir un modal para editar el producto
  // Ejemplo de redirección a una página de edición:
  // this.router.navigate(['/editar-producto', producto.nombre]);
  alert(`Editar producto: ${producto.nombre}`);
  // Implementa la lógica para la edición del producto.
}
  }




