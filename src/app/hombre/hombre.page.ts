import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Producto } from '../producto/model/producto';
import { Router } from '@angular/router';
import { ApiproductsService } from '../services/apiproducts.service';
import { CarritoService } from '../services/carrito.service';


@Component({
  selector: 'app-hombre',
  templateUrl: './hombre.page.html',
  styleUrls: ['./hombre.page.scss'],
})
export class HombrePage implements OnInit {
  productos: Producto[] = [];
  constructor(
    private router: Router,
    private apiProductsService: ApiproductsService, 
    private cdr: ChangeDetectorRef,
    private carritoService: CarritoService
  ) { }

  ngOnInit() {
    this.apiProductsService.getProducts().subscribe(
      (productos) => {
        this.productos = productos.filter(producto => producto.categoria === 'Hombre');
        console.log('Productos filtrados:', this.productos);
        this.cdr.detectChanges(); // Fuerza la actualización de la vista
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
      }
    );
  }
  
  

  // Método para ver el detalle de un producto
verDetalle(id: number) {
  this.router.navigate(['/detalle-producto'], {
    queryParams: { id: id },
  });
}

 

  async agregarAlCarrito(producto: Producto) {
    try {
      // Crear un objeto compatible con el método `addToCart`
      const productoCarrito = {
        id: producto.id,
        nombre: producto.nombre, // Mapear 'nombre' a 'name'
        precio: producto.precio, // Mapear 'precio' a 'price'
        cantidad: producto.cantidad,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        categoria: producto.categoria,
      };
  
      // Llamamos al servicio para agregar el producto a SQLite
      await this.carritoService.addToCart(productoCarrito);
  
      // Si no ocurre un error, consideramos que se agregó correctamente
      console.log(`Producto ${producto.nombre} agregado al carrito`);
    } catch (error) {
      console.error('Error al agregar al carrito', error);
    }
  }

}
