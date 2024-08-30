import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Añadir el decorador @Component
@Component({
  selector: 'app-product-detail', // Cambia el selector a algo relevante
  templateUrl: './product-detail.page.html', // Ruta al archivo de la plantilla HTML
  styleUrls: ['./product-detail.page.scss'] // Ruta a los estilos específicos de este componente
})
export class ProductDetailPage implements OnInit {
  productId: number | undefined;
  product: any | undefined;
  selectedColor: string | undefined; // Color seleccionado por el usuario

  // Lista de productos con al menos dos colores
  products = [
    {id: 1,
      name: 'Poleron loose fit Hombre',
      description: 'Confeccionado en 100% algodon',
      price: 15.990,
      image:'assets/images/products/hombre/poleron_hombre/hoddie1.webp', colors: ['Negro', 'Morado']  
    },
    {id:11,
      name:'Polera regular hombre',
      description:'confeccionado 100% algodon',
      price: 12.990,
      image:'assets/images/products/hombre/poleras_hombre/polera1.webp', colors: ['Negro', 'Morado']
     },
    {
      id:21,
      name:'jeans tapper fit hombre',
      description:'confeccionado 100% con reciclaje',
      price: 18.990,
      image:'assets/images/products/hombre/jeans_hombre/jeans1.webp', colors: ['Negro', 'Morado']
    },
      
     {id:31,
      name:'Zapatilla urbana New balance hombre',
      description:'Modelo: 1002, inspirado en .........',
      price: 99.990,
      image:'assets/images/products/hombre/zapatillas_hombre/new1.webp', colors: ['Negro', 'Morado']
     },
     {id:41,
      name:'Poleron regular mujer',
      description:'confeccionado 100% algodon',
      price: 22.990,
      image:'assets/images/products/mujer/poleron_mujer/poleron1.webp', colors: ['Negro', 'Morado']
     },
     {id:51,
      name:'Polera regular mujer',
      description:'confeccionado 100% algodon',
      price: 17.990,
      image:'assets/images/products/mujer/polera_mujer/polera1.webp', colors: ['Negro', 'Morado']
     },
     {id:61,
      name:'Jeans topper mujer',
      description:'confeccionado 100% con reciclados',
      price: 25.990,
      image:'assets/images/products/mujer/jeans_mujer/jeans1.webp', colors: ['Negro', 'Morado']
     },
     {id:71,
      name:'zapatilla urbana mujer nike',
      description:'Modelo: nike dunk low rosas',
      price: 120.990,
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
