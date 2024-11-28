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
  productosApi: Producto[] = []; // Todos los productos de la API
  productosFiltrados: Producto[] = []; // Productos filtrados para la búsqueda
  searchTerm: string = ''; // Término de búsqueda

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
    private apiproducts: ApiproductsService,
    private carritoservice: CarritoService
  ) {
 
    this.sqliteService.getUsername().then(username => {
      this.nombreUsuario = username;
    });
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
    // Cargar productos y nombre de usuario al inicializar
    this.cargarProductosFiltrados();
    this.cargarTodosLosProductosDesdeAPI();
    await this.cargarNombreUsuario(); // Nueva función centralizada
    await this.createMap(); // Crear el mapa
  }

  async cargarNombreUsuario() {
    try {
      // Intentar obtener el nombre del usuario desde SQLite
      const usuario = await this.sqliteService.getCurrentUser();
      this.nombreUsuario = usuario?.username || null;

      // Si no está en SQLite, intenta obtenerlo de localStorage
      if (!this.nombreUsuario) {
        this.nombreUsuario = localStorage.getItem('currentUser');
      }
    } catch (error) {
      console.error('Error cargando el nombre de usuario:', error);
      this.nombreUsuario = null;
    }
  }

  
 // Función para cargar productos filtrados que se mostrarán en el home
 cargarProductosFiltrados() {
  this.apiproducts.getProducts().subscribe(
    (data: Producto[]) => {
      if (Array.isArray(data)) {
        // Filtra los productos para que solo se carguen los de los IDs que especificaste
        const idsPermitidos = [1, 20, 39, 40, 61, 70, 82, 90, 45, 52];
        this.productos = data.filter(producto => idsPermitidos.includes(producto.id));
        this.productosFiltrados = [...this.productos]; // Inicializa los productos filtrados con los productos filtrados por ID
      } else {
        console.error('La respuesta no es un arreglo:', data);
      }
    },
    (error) => {
      console.error('Error cargando productos:', error);
    }
  );
}

// Función para cargar todos los productos de la API
cargarTodosLosProductosDesdeAPI() {
  this.apiproducts.getProducts().subscribe(
    (data: Producto[]) => {
      if (Array.isArray(data)) {
        this.productosApi = data; // Guarda todos los productos en productosApi
      } else {
        console.error('La respuesta no es un arreglo:', data);
      }
    },
    (error) => {
      console.error('Error cargando productos desde API:', error);
    }
  );
}

// Método para filtrar productos según el término de búsqueda
filtrarProductos() {
  if (this.searchTerm.trim() === '') {
    // Si no hay búsqueda, mostramos todos los productos cargados desde la API
    this.productosFiltrados = [...this.productosApi];
  } else {
    // Si hay búsqueda, filtramos solo por el nombre del producto
    this.productosFiltrados = this.productosApi.filter((producto) =>
      producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) // Comparación insensible a mayúsculas
    );
  }
}

// Este método se llama cuando el valor de la barra de búsqueda cambia
onSearchChange(event: any) {
  this.searchTerm = event.detail.value;
  this.filtrarProductos(); // Llama al método para filtrar
}

// Método para ver el detalle de un producto
verDetalle(id: number) {
  this.router.navigate(['/detalle-producto'], {
    queryParams: { id: id },
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
    await this.carritoservice.addToCart(productoCarrito);

    // Si no ocurre un error, consideramos que se agregó correctamente
    console.log(`Producto ${producto.nombre} agregado al carrito`);
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
  this.sqliteService.logout();
  this.router.navigate(['/login']);
}
}