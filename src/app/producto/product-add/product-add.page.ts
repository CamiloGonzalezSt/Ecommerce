// add.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Producto } from '../model/producto';


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage  {
  producto: Producto = {
    id:0,
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    imagen: '',
    categoria: ''
  };

  categorias: string[] = ['Hombre', 'Mujer', 'Tecnología', 'Hogar'];

  constructor(private sqliteService: SqliteService, private router: Router) {}
  // Método para manejar la selección de la imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.producto.imagen = reader.result as string; // Asignar la imagen seleccionada al producto
      };
      reader.readAsDataURL(file);
    }
  }

  async agregarProducto() {
    if (
      this.producto.nombre &&
      this.producto.descripcion &&
      this.producto.precio &&
      this.producto.cantidad &&
      this.producto.imagen && // Verificar que la imagen esté seleccionada
      this.producto.categoria // Verificar que la categoría esté seleccionada
    ) {
      try {
        await this.sqliteService.createProduct(this.producto);
        alert('Producto agregado exitosamente');
        this.router.navigate(['/product-list']); // Navega a la página de lista después de agregar
      } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto');
      }
    } else {
      alert('Por favor, complete todos los campos');
    }
  }
  
}
