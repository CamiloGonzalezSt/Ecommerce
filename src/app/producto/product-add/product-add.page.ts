import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit {
  
  nombreProducto: string;
  precio: number;
  descripcion: string;
  cantidad: number;


  constructor(
    private sqlite: SqliteService,
    private router: Router
  ) {  }

  async ngOnInit() {
    this.sqlite.createOpenDatabase();
  }

  agregarProducto() {
    this.sqlite.insertData(this.nombreProducto, this.descripcion, this.precio, this.cantidad)
      .then(() => {
        alert('Producto agregado con éxito');
        this.router.navigate(['/product-list']);  // Navega a la lista de productos después de agregar
      })
      .catch((error) => {
        console.error('Error al agregar el producto', error);
      });
  }

  
}
