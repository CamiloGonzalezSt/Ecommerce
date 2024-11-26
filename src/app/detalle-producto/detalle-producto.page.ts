import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-producto', // Cambiado el selector a 'detalle-producto'
  templateUrl: './detalle-producto.page.html', // Cambia la ruta al nuevo archivo HTML
  styleUrls: ['./detalle-producto.page.scss'] // Cambia la ruta a los estilos
})
export class DetalleProductoPage implements OnInit {
  productId: number | undefined;
  product: any | undefined;
  selectedColor: string | undefined; // Color seleccionado por el usuario

  // Lista de productos con al menos dos colores
  products = [
    {id: 1,
      name: 'Poleron loose fit Hombre',
      description: 'Confeccionado en 100% algodón',
      price: 15990,
      image:'assets/images/products/hombre/poleron_hombre/hoddie1.webp', colors: ['Negro', 'Morado']  
    },
    {id: 100, name: 'Zapatillas Mujer New Balance 990v5', description: 'Zapatillas New Balance 990v5 para mujer, perfectas para una comodidad superior y estilo.', price: 119900, image: 'assets/images/products/mujer/zapatillas_mujer/new1.webp', colors: ['Negro', 'Morado']},
    {id: 200, name: 'Jeans Mujer Casual', description: 'Jeans cómodos y versátiles para mujer, ideales para cualquier ocasión.', price: 17900, image: 'assets/images/products/mujer/jeans_mujer/jeans1.webp', colors: ['Negro', 'Morado']},
    {id: 300, name: 'Polera Mujer Básica', description: 'Polera básica para mujer, cómoda y ligera, ideal para el día a día.', price: 15900, image: 'assets/images/products/mujer/polera_mujer/polera1.webp', colors: ['Negro', 'Morado']},
    {id: 400, name: 'Polerón Mujer Casual', description: 'Polerón cómodo y ligero, perfecto para el uso diario.', price: 14990, image: 'assets/images/products/mujer/poleron_mujer/poleron1.webp', colors: ['Negro', 'Morado']},
    
    {id: 11,
      name:'Polera regular hombre',
      description:'Confeccionado 100% algodón',
      price: 12990,
      image:'assets/images/products/hombre/poleras_hombre/polera1.webp', colors: ['Negro', 'Morado']
    },
    {
      id: 21,
      name:'Jeans tapper fit hombre',
      description:'Confeccionado 100% con reciclaje',
      price: 18990,
      image:'assets/images/products/hombre/jeans_hombre/jeans1.webp', colors: ['Negro', 'Morado']
    },
    {id: 31,
      name:'Zapatilla urbana New balance hombre',
      description:'Modelo: 1002, inspirado en .........',
      price: 99990,
      image:'assets/images/products/hombre/zapatillas_hombre/new1.webp', colors: ['Negro', 'Morado']
    },
    {id: 41,
      name:'Poleron regular mujer',
      description:'Confeccionado 100% algodón',
      price: 22990,
      image:'assets/images/products/mujer/poleron_mujer/poleron1.webp', colors: ['Negro', 'Morado']
    },
    {id: 51,
      name:'Polera regular mujer',
      description:'Confeccionado 100% algodón',
      price: 17990,
      image:'assets/images/products/mujer/polera_mujer/polera1.webp', colors: ['Negro', 'Morado']
    },
    {id: 61,
      name:'Jeans topper mujer',
      description:'Confeccionado 100% con reciclados',
      price: 25990,
      image:'assets/images/products/mujer/jeans_mujer/jeans1.webp', colors: ['Negro', 'Morado']
    },

    
    {id: 71,
      name:'Zapatilla urbana mujer Nike',
      description:'Modelo: Nike Dunk Low Rosas',
      price: 120990,
      image:'assets/images/products/mujer/zapatillas_mujer/nike1.webp', colors: ['Negro', 'Morado']
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.productId = +params['id'];
      this.product = this.getProductById(this.productId);
    });
  }

  getProductById(id: number) {
    return this.products.find(product => product.id === id);
  }

  onColorSelect(color: string) {
    this.selectedColor = color;
    console.log(`Color seleccionado: ${this.selectedColor}`);
  }
}