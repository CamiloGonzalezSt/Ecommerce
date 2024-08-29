import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {



user :{
  usuario: string;
  password: string
} | undefined;

products =[
    {id: 1,
    name: 'Poleron loose fit Hombre',
    description: 'Confeccionado en 100% algodon',
    price: 15.990,
    image:'assets/images/products/hombre/poleron_hombre/hoddie1.webp'
  },
  {id:11,
    name:'Polera regular hombre',
    description:'confeccionado 100% algodon',
    price: 12.990,
    image:'assets/images/products/hombre/poleras_hombre/polera1.webp'
   },
  {
    id:21,
    name:'jeans tapper fit hombre',
    description:'confeccionado 100% con reciclaje',
    price: 18.990,
    image:'assets/images/products/hombre/jeans_hombre/jeans1.webp'
  },
    
   {id:31,
    name:'Zapatilla urbana New balance hombre',
    description:'Modelo: 1002, inspirado en .........',
    price: 99.990,
    image:'assets/images/products/hombre/zapatillas_hombre/new1.webp'
   },
   {id:41,
    name:'Poleron regular mujer',
    description:'confeccionado 100% algodon',
    price: 22.990,
    image:'assets/images/products/mujer/poleron_mujer/poleron1.webp'
   },
   {id:51,
    name:'Polera regular mujer',
    description:'confeccionado 100% algodon',
    price: 17.990,
    image:'assets/images/products/mujer/polera_mujer/polera1.webp'
   },
   {id:61,
    name:'Jeans topper mujer',
    description:'confeccionado 100% con reciclados',
    price: 25.990,
    image:'assets/images/products/mujer/jeans_mujer/jeans1.webp'
   },
   {id:71,
    name:'zapatilla urbana mujer nike',
    description:'Modelo: nike dunk low rosas',
    price: 120.990,
    image:'assets/images/products/mujer/zapatillas_mujer/nike1.webp'
   },
   
   
   
]



  constructor(private activeroute: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe(params => {
      this.user = {
        usuario: params['usuario'],
        password: params['password']
      };
      console.log("Received user data:", this.user);
    });
  }
}
