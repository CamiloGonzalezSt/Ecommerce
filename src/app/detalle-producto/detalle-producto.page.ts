import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiproductsService } from '../services/apiproducts.service'; // Asegúrate de que este import es correcto
import { CarritoService } from '../services/carrito.service'; // Asegúrate de importar el servicio CarritoService
import { Producto } from '../producto/model/producto'; // Asegúrate de que este import es correcto

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss']
})
export class DetalleProductoPage implements OnInit {
  productId: number | undefined;  // ID del producto recibido
  product: Producto | undefined; // Producto seleccionado
  selectedColor: string | undefined; // Color seleccionado por el usuario

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiproductsService, // Inyecta el servicio de productos
    private carritoService: CarritoService // Inyecta el servicio del carrito
  ) {}

  ngOnInit() {
    // Obtener el ID del producto desde los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.productId = +params['id']; // Convertir el id a número
      if (this.productId) {
        this.getProductDetails(this.productId); // Obtener los detalles del producto
      }
    });
  }

  // Método para obtener el producto por ID
  getProductDetails(id: number) {
    this.apiService.getProducts().subscribe(
      (productos) => {
        // Buscar el producto con el id correspondiente
        this.product = productos.find((producto) => producto.id === id);
      },
      (error) => {
        console.error('Error al obtener los detalles del producto:', error);
      }
    );
  }

  // Función para agregar el producto al carrito
  agregarAlCarrito() {
    if (this.product) {
      this.carritoService.addToCart(this.product); // Llama a la función de agregar al carrito
      console.log(`Producto ${this.product.nombre} agregado al carrito`);
    }
  }
}
