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
    name: 'Camiseta',
    description: 'Camiseta de algodón 100%',
    price: 19.99,
    image:'assets/images/products/hoddie1.webp'
  },
  {id: 2,
    name: 'Camiseta',
    description: 'Camiseta de algodón 100%',
    price: 19.99,
    image:'assets/images/products/hoddie2.webp'
  },
  {id: 3,
    name: 'Camiseta',
    description: 'Camiseta de algodón 100%',
    price: 19.99,
    image:'assets/images/products/hoddie3.webp'
  },
  {id: 4,
    name: 'Camiseta',
    description: 'Camiseta de algodón 100%',
    price: 19.99,
    image:'assets/images/products/hoddie4.webp'
  },
]



  constructor(private activeroute: ActivatedRoute) {}

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
