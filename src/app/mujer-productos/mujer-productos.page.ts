import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-mujer-productos',
  templateUrl: './mujer-productos.page.html',
  styleUrls: ['./mujer-productos.page.scss'],
})
export class MujerProductosPage implements OnInit {

  // Array de productos con las imágenes en assets
  productosFiltrados = [
    {
      id: 100,
      nombre: 'Zapatillas Mujer New Balance 990v5',
      descripcion: 'Zapatillas New Balance 990v5 para mujer, perfectas para una comodidad superior y estilo.',
      precio: 119900,
      imagen: 'assets/images/products/mujer/zapatillas_mujer/new1.webp'
    },
    {
      id: 200,
      nombre: 'Jeans Mujer Casual',
      descripcion: 'Jeans cómodos y versátiles para mujer, ideales para cualquier ocasión.',
      precio: 17900,
      imagen: 'assets/images/products/mujer/jeans_mujer/jeans1.webp'
    },
    {
      id: 300,
      nombre: 'Polera Mujer Básica',
      descripcion: 'Polera básica para mujer, cómoda y ligera, ideal para el día a día.',
      precio: 15900,
      imagen: 'assets/images/products/mujer/polera_mujer/polera1.webp'
    },
    {
      id: 400,
      nombre: 'Polerón Mujer Casual',
      descripcion: 'Polerón cómodo y ligero, perfecto para el uso diario.',
      precio: 14990,
      imagen: 'assets/images/products/mujer/poleron_mujer/poleron1.webp'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {}

  verDetalles(id: number) {
    // Redirige a la página de detalles del producto con el ID
    this.router.navigate(['/detalle-producto', id]);
  }
  // Función para agregar un producto al carrito (puedes implementarla según tus necesidades)
  agregarAlCarrito(producto: any) {
    console.log(`${producto.nombre} agregado al carrito`);
  }
}
