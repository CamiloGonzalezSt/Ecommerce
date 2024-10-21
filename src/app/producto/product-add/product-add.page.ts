import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';



@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit {

  nombreProducto: string;
  precio: number;
  descripcion:  string;
  cantidad: number;

  constructor(
    private sqlite: SqliteService ) {}

  async ngOnInit() {
    this.sqlite.createOpenDatabase();
  }

  agregarProducto() {
    this.sqlite.insertData(this.nombreProducto, this.descripcion, this.precio, this.cantidad)
    .then(() => {
      alert('Producto agregado con éxito');
    })
    .catch((error) => {
      console.error('Error al agregar el producto', error);
    });
}
}
