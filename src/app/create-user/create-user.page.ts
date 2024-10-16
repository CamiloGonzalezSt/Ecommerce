import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service'; // Asegúrate de importar correctamente el servicio
import { Router } from '@angular/router';
import { ProductoService } from '../services/product.service';
import { ClProducto } from '../producto/model/ClProducto';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  // Variables para enlazar con los inputs
  product: ClProducto = { id: 0, nombre: '', descripcion: '', precio: 0, fecha: new Date(), cantidad: 0 };
  usuario: string = ''; // Nombre de usuario
  password: string = ''; // Contraseña
  

  constructor(private sqliteService: SqliteService, private router: Router, private productService: ProductoService) { }

  ngOnInit() {}

  // Método para crear un usuario
  createUser() {
    console.log('Username:', this.usuario);
    console.log('Password:', this.password);
    if (this.usuario && this.password) {
      const success = this.sqliteService.createUser(this.usuario, this.password);
      if (success) {
        alert('Usuario creado exitosamente');
        this.router.navigate(['/login']);
      } else {
        alert('El usuario ya existe');
      }
    } else {
      alert('Por favor ingresa todos los campos');
    }
  }

  async createProduct() {
    if (this.product.nombre && this.product.descripcion && this.product.precio > 0 && this.product.cantidad) {
      await this.productService.addProducto(this.product);
      console.log('Producto creado');
      // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito
    } else {
      console.log('Por favor, complete todos los campos');
    }
  }

 }
