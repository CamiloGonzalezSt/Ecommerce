/// <reference types="@types/google.maps" />
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import SwiperCore from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';  // Importa GoogleMap para el mapa
import { SqliteService } from '../services/sqlite.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CarritoService } from '../services/carrito.service';
import { AuthService } from '../services/auth.service';
import { Producto } from '../producto/model/producto';
import { ApiproductsService } from '../services/apiproducts.service';




// Configura los módulos que vas a utilizar
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;
  productos: Producto[] = [];
  nombreUsuario: string | null = null;
  

  banners: string[] = [
    'assets/images/banner/banner1.webp',
    'assets/images/banner/banner2.webp',
    'assets/images/banner/banner3.webp',
  ];

  map: GoogleMap;  // Variable para el mapa

  constructor(
    private activeroute: ActivatedRoute, 
    private router: Router, 
    private animationCtrl: AnimationController,
    private sqliteService: SqliteService,
    private inAppBrowser: InAppBrowser,
    private authservice: AuthService,
    private apiproducts: ApiproductsService,
    private carritoservice: CarritoService
  ) {
 
    this.nombreUsuario = this.sqliteService.getUsername();
  }

  

  ngAfterViewInit() {
    const swiper = new SwiperCore('.swiper-container', {
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      loop: true,
      pagination: { clickable: true },
      navigation: true
    });
  }

  animateCartButton() {
    const button = document.getElementById('cartButton');
    if (button) {
      // Crear una animación usando AnimationController
      const animation = this.animationCtrl.create()
        .addElement(button)
        .duration(200)
        .iterations(1)
        .fromTo('transform', 'scale(1)', 'scale(1.2)')
        .fromTo('opacity', '1', '0.5')
        .fromTo('transform', 'scale(1.2)', 'scale(1)')
        .fromTo('opacity', '0.5', '1');
      
      // Iniciar la animación
      animation.play();
    }
  }

  async ngOnInit() {
    //aqui nos carga los productos que en esa funcion llama desde el json en apiservice
    this.cargarProductos();

    this.nombreUsuario = this.sqliteService.getUsername();

    // Llama a la función para crear el mapa cuando la página se inicialice
    await this.createMap();
    await this.sqliteService.init();
  
  }

  //aqui cargamos los productos con los id que nosotros queramos como del id 1 al 6
  cargarProductos() {
    this.apiproducts.getProductos().subscribe((data: Producto[]) => {
      // Asegúrate de que todos los productos tengan un id numérico
      this.productos = data.map((producto) => ({
        ...producto,
        id: typeof producto.id === 'string' ? parseInt(producto.id, 10) : producto.id
      })).filter((producto) => producto.id >= 1 && producto.id <= 6);
    });
  }
  
  

  async createMap() {
    // Crear el mapa
    this.map = await GoogleMap.create({
      id: 'my-map', // Un ID único para el mapa
      element: document.getElementById('map') as HTMLElement, // Contenedor del mapa
      apiKey: 'AIzaSyCsGGf9_VzZd7-PJldeBLq159hXp7stEcU', // Tu API Key
      config: {
        center: {
          lat: -33.4489, // Coordenadas iniciales (Santiago, Chile)
          lng: -70.6693,
        },
        zoom: 12, // Zoom inicial
      },
    });

    // Solicitar geolocalización en tiempo real
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Actualizar el centro del mapa a la ubicación en tiempo real
          await this.map.setCamera({
            coordinate: {
              lat: latitude,
              lng: longitude,
            },
            zoom: 15, // Ajusta el zoom para centrarse mejor en el usuario
          });

          // Agregar un marcador para la ubicación actual
          await this.map.addMarker({
            coordinate: {
              lat: latitude,
              lng: longitude,
            },
            title: "Mi ubicación",
            snippet: "Ubicación en tiempo real",
          });
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
        },
        {
          enableHighAccuracy: true, // Utilizar la mejor precisión disponible
          timeout: 10000, // Tiempo máximo para obtener la ubicación
          maximumAge: 0, // No usar una ubicación previamente almacenada
        }
      );
    } else {
      console.error('Geolocalización no es compatible con este navegador.');
    }
  }

//boton de whatsapp

openWhatsApp() {
  const phoneNumber = "56934116232"; // Reemplaza con el número de WhatsApp con el código de país sin '+'
  const url = `https://wa.me/${phoneNumber}`;
  this.inAppBrowser.create(url, '_system');
}


async agregarAlCarrito(producto: Producto) {
  try {
    // Llamamos al servicio para agregar el producto a SQLite
    const resultado = await this.carritoservice.addToCart(producto);
    
    if (resultado.success) {
      console.log(`Producto ${producto.nombre} agregado al carrito`);
    } else {
      console.error('Error al agregar producto al carrito');
    }
  } catch (error) {
    console.error('Error al agregar al carrito', error);
  }
}

// Método simulado para obtener productos desde JSON o API
async obtenerDatosDeJSON(): Promise<Producto[]> {
  return new Promise(resolve => {
    resolve([
      { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, imagen: 'url_imagen_1', categoria: 'Categoria 1', cantidad: 10 },
      { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', precio: 200, imagen: 'url_imagen_2', categoria: 'Categoria 2', cantidad: 20 },
    ]);
  });
}

// Método para agregar productos al carrito
async obtenerProductosDesdeJSON() {
  // Suponiendo que los productos vienen de una API o archivo JSON
  const productosJSON = await this.obtenerDatosDeJSON();

  // Una vez que tienes los productos, puedes agregarlos al carrito (SQLite)
  productosJSON.forEach(async (producto: Producto) => {
    await this.agregarAlCarrito(producto);
  });
}

logout() {
  this.authservice.logout();
  this.router.navigate(['/login']);
}
}