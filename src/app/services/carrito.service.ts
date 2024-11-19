import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: any[] = [];

  constructor() { }

  obtenerCarrito() {
    return this.carrito;
  }

  agregarAlCarrito(producto: any) {
    // Buscamos el producto por nombre en vez de por id
    const itemExistente = this.carrito.find(item => item.name === producto.name); 
    
    if (itemExistente) {
      itemExistente.cantidad += 1; // Si el producto ya existe en el carrito, aumentamos la cantidad
    } else {
      // Si el producto no existe, lo agregamos con cantidad 1
      this.carrito.push({ ...producto, cantidad: 1 });
    }
  }

  eliminarDelCarrito(name: string) {
    // Eliminamos el producto por nombre
    this.carrito = this.carrito.filter(item => item.name !== name);
  }

  obtenerTotal() {
    // Calculamos el total usando el nombre y cantidad
    return this.carrito.reduce((total, item) => total + item.price * item.cantidad, 0);
  }

  actualizarCantidad(name: string, cantidad: number) {
    // Buscamos el producto por nombre y actualizamos su cantidad
    const producto = this.carrito.find(item => item.name === name);
    
    if (producto) {
      producto.cantidad = cantidad;
      if (producto.cantidad <= 0) {
        // Si la cantidad es 0 o menor, lo eliminamos del carrito
        this.eliminarDelCarrito(name);
      }
    }
  }
}
