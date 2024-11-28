import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiproductsService } from 'src/app/services/apiproducts.service';
import { Producto } from '../model/producto'; 
import { SqliteService } from 'src/app/services/sqlite.service';
import { firstValueFrom, from } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage implements OnInit {
  
 
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    imagen: string;
    categoria: string;
  

  categorias: string[] = ['Hombre', 'Mujer', 'Tecnología', 'Hogar'];  // Lista de categorías

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ApiproductsService,  // Servicio para manejar los productos
    private sqlite: SqliteService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // Asegúrate de que params['id'] contenga un valor válido
      console.log('ID recibido desde la URL:', params['id']);
      this.id = Number(params['id']); // Convertirlo a número
  
      // Verificar si el id es válido
      if (isNaN(this.id) || this.id <= 0) {
        console.error('ID inválido recibido:', this.id);
        alert('ID inválido recibido');
        return;
      }
      console.log('ID validado correctamente:', this.id);
      this.cargarProducto(this.id);
    });
  }

  // Función para cargar el producto desde el servicio
  async cargarProducto(id: number) {
    try {
      const productos: Producto[] = await this.productService.getProducts().toPromise() || [];
      const productoEncontrado = productos.find(p => p.id === id); // Compara como número
  
      if (productoEncontrado) {
        this.nombre = productoEncontrado.nombre;
        this.descripcion = productoEncontrado.descripcion;
        this.precio = productoEncontrado.precio;
        this.cantidad = productoEncontrado.cantidad;
        this.imagen = productoEncontrado.imagen;
        this.categoria = productoEncontrado.categoria;
      } else {
        console.error('Producto no encontrado');
        alert('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      alert('Error al cargar el producto: ' + error);
    }
  }
  

  // Función para guardar los cambios en el producto
  async guardarCambios() {
    if (!this.imagen) {
      alert('Por favor, selecciona una imagen');
      return;
    }
  
    const updatedProduct: Producto = {
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
      await this.sqlite.updateProduct(this.id, updatedProduct);
  
      // Luego, actualiza en JSON Server utilizando from() para convertir la promesa en un observable
      await firstValueFrom(from(this.productService.updateProduct(this.id, updatedProduct)));
  
      alert('Producto actualizado con éxito');
      this.router.navigate(['/product-list']);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto: ' + error);
    }
  }
  
  // Método para manejar la selección de la imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagen = reader.result as string; // Asignar la imagen seleccionada al producto
      };
      reader.readAsDataURL(file);
    } else {
      this.imagen = ''; // Si no se seleccionó archivo, aseguramos que imagen no sea undefined
    }
  }
  
}
