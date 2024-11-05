import { Component, OnInit } from '@angular/core';
import { producto } from '../model/ClProducto';

@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.page.html',
  styleUrls: ['./product-all.page.scss'],
})
export class ProductAllPage implements OnInit {
  msgError = ""
  buttonEliminarDisabled = false
  buttonLeerDisabled = false
  buttonActualizarDisabled = false
  buttonCrearDisabled = false
  producto: producto = { id: '',  nombre: '', descripcion: '', precio: 0, cantidad:0 };;

  constructor() { }
  ngOnInit() {  }



  leer() {}
  eliminar() { }
  grabar() { }
  actualizar() { }
  grabarActualizarAutomatico() { }
}
