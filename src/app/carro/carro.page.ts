// src/app/carro/carro.page.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-carro',
  templateUrl: './carro.page.html',
  styleUrls: ['./carro.page.scss'],
})
export class CarroPage implements OnInit {
  carrito: any[] = [];
  total: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carrito = this.carritoService.obtenerCarrito();
    this.calcularTotal();
  }

  // Actualiza la cantidad de un producto y el total
  actualizarCantidad(item: any, cantidad: number) {
    item.cantidad = cantidad;
    item.total = item.price * item.cantidad;
    this.actualizarTotal();
  }
  actualizarTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.total || item.price * item.cantidad), 0);
  }

  // Calcular el total a pagar
  calcularTotal() {
    this.total = this.carritoService.obtenerTotal();
  }
}
