import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service'; // Asegúrate de importar correctamente el servicio
import { Router } from '@angular/router';
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

  constructor(private sqliteService: SqliteService, private router: Router) { }

  async ngOnInit() {
    await this.sqliteService.init();
  }

  // Método para crear un usuario
  async createUser() {
    console.log('Username:', this.usuario);
    console.log('Password:', this.password);
   
    // Validar que los campos no estén vacíos
    if (this.usuario && this.password) {
      // Crear el usuario usando el servicio
      const success = await this.sqliteService.createUser(this.usuario, this.password);
      if (success) {
        alert('Usuario creado exitosamente y agregado a la API');
        this.router.navigate(['/login']); // Redirigir al usuario a la página de login
      } else {
        alert('El usuario ya existe');
      }
    } else {
      alert('Por favor ingresa todos los campos');
    }
  }

  // Método para crear un producto
  async createProduct() {
    if (this.product.nombre && this.product.descripcion && this.product.precio > 0 && this.product.cantidad) {
      await this.sqliteService.addProduct(this.product); // Asegúrate de que este método exista en el servicio
      console.log('Producto creado');
      alert('Producto creado exitosamente'); // Mensaje de éxito
    } else {
      console.log('Por favor, complete todos los campos');
      alert('Por favor, complete todos los campos');
    }
  }
}
