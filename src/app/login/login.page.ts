import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  user = {
    usuario: '',
    password: ''
  };

  passwordValid: boolean = true;

  constructor(private router: Router, private sqliteService: SqliteService, private modalController: ModalController) {
    this.loadUserFromLocalStorage(); // Cargar datos de usuario si existen en localStorage
  }

  // Función para cargar el usuario desde localStorage
  loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser); // Convertimos el JSON a un objeto
    }
  }

  // Función para guardar el usuario en localStorage
  saveUserToLocalStorage() {
    localStorage.setItem('user', JSON.stringify(this.user)); // Guardamos el usuario como JSON
  }

  async mostrarLista() {
    const modal = await this.modalController.create({
      component: ListaUsuariosComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async ingresar() {
    if (this.isPasswordValid(this.user.password)) {
      const token = await this.sqliteService.login(this.user.usuario, this.user.password);
      if (token) {
        localStorage.setItem('auth_token', token); // Guardar el token en localStorage
        this.saveUserToLocalStorage(); // Guardar el usuario
        let navigationExtras: NavigationExtras = {
          state: { user: this.user }
        };
        this.router.navigate(['/home'], navigationExtras);
      } else {
        this.passwordValid = false; // Indica que la validación falló
      }
    } else {
      this.passwordValid = false; // Indica que la validación falló
    }
  }

  async registrar() {
    if (this.isPasswordValid(this.user.password)) {
      console.log('Registro no implementado, pero contraseña válida.');
    } else {
      this.passwordValid = false;
    }
  }
  

  isPasswordValid(password: string): boolean {
    // Regex para al menos 4 números, 3 caracteres alfanuméricos/especiales, y 1 mayúscula
    const regex = /^(?=(?:.*\d){4})(?=(?:.*[a-zA-Z]){3})(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  }

  // Función para cerrar sesión y limpiar el localStorage
  //logout() {
  //  localStorage.removeItem('user'); // Elimina el usuario de localStorage
  //  this.user = { usuario: '', password: '' }; // Limpia los datos de usuario en el componente
  //  this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  //}
}
