import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import SwiperCore from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';

// Configura los módulos que vas a utilizar
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;
  data: any;

  products = [
    {
      id: 71,
      name: 'Zapatillas Mujer New Balance 990v5',
      description: 'Zapatillas New Balance 990v5 para mujer, perfectas para una comodidad superior y estilo.',
      price: 119900,
      image: 'assets/images/products/mujer/zapatillas_mujer/new1.webp'
    },
    {
      id: 61,
      name: 'Jeans Mujer Casual',
      description: 'Jeans cómodos y versátiles para mujer, ideales para cualquier ocasión.',
      price: 17900,
      image: 'assets/images/products/mujer/jeans_mujer/jeans1.webp'
    },
    {
      id: 51,
      name: 'Polera Mujer Básica',
      description: 'Polera básica para mujer, cómoda y ligera, ideal para el día a día.',
      price: 15900,
      image: 'assets/images/products/mujer/polera_mujer/polera1.webp'
    },
    {
      id: 41,
      name: 'Polerón Mujer Casual',
      description: 'Polerón cómodo y ligero, perfecto para el uso diario.',
      price: 14990,
      image: 'assets/images/products/mujer/poleron_mujer/poleron1.webp'
    },
    {
      id: 31,
      name: 'New Balance 990v5',
      description: 'Zapatillas New Balance 990v5, perfectas para una comodidad superior y estilo.',
      price: 119900,
      image: 'assets/images/products/hombre/zapatillas_hombre/new1.webp'
    },
    {
      id: 21,
      name: 'Jeans Casual Hombre',
      description: 'Jeans cómodos y versátiles, ideales para cualquier ocasión.',
      price: 17990,
      image: 'assets/images/products/hombre/jeans_hombre/jeans1.webp'
    },
    {
      id: 11,
      name: 'Polera Hombre Básica',
      description: 'Polera cómoda y ligera, ideal para el día a día.',
      price: 13990,
      image: 'assets/images/products/hombre/poleras_hombre/polera1.webp'
    },
    {
      id: 1,
      name: 'Hoddie Hombre Urbano',
      description: 'Polerón con capucha, suave y cómodo para el uso diario.',
      price: 25990,
      image: 'assets/images/products/hombre/poleron_hombre/hoddie1.webp'
    },
  ];

  banners: string[] = [
    'assets/images/banner/banner1.webp',
    'assets/images/banner/banner2.webp',
    'assets/images/banner/banner3.webp',
    
  ];

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
  
  

  constructor(private activeroute: ActivatedRoute, private router: Router, private animationCtrl: AnimationController) {}
  
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

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.data = navigation.extras.state['user'];
      console.log('Datos del usuario recibidos:', this.data);
    }
  }
  }
