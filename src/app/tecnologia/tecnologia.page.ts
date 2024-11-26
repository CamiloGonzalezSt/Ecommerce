import { Component } from '@angular/core';

@Component({
  selector: 'app-tecnologia',
  templateUrl: './tecnologia.page.html',
  styleUrls: ['./tecnologia.page.scss'],
})
export class TecnologiaPage {
  productos = [
    {
      nombre: 'Laptop Gamer',
      precio: 1200,
      imagen: 'assets/images/products/tecnologia/2000399428124_2.jpg',
      descripcion: 'Laptop de alto rendimiento ideal para juegos.',
    },
    {
      nombre: 'Auriculares AIRPODS ',
      precio: 150,
      imagen: 'assets/images/products/tecnologia/2000398382649-1.jpg',
      descripcion: 'Auriculares con cancelación de ruido y batería de larga duración.',
    },
    {
      nombre: 'IPHONE 13',
      precio: 800,
      imagen: 'assets/images/products/tecnologia/2000398327909_2.jpg',
      descripcion: 'Teléfono inteligente con cámara de alta calidad.',
    },
    {
      nombre: 'Audifonos Sony',
      precio: 400,
      imagen: 'assets/images/products/tecnologia/2000381258203_2.jpg',
      descripcion: 'Audifonos de alta gama para disfrutar de contenido multimedia.',
    },
  ];

  carrito: any[] = [];

  agregarAlCarrito(producto: any) {
    this.carrito.push(producto);
    console.log('Producto agregado al carrito:', producto);
    alert(`${producto.nombre} ha sido agregado al carrito.`);
  }
}
