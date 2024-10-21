import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    usuario: '',
    password: ''
  };

  passwordValid: boolean = true;
  errorMessage: string = ''; // Para mostrar mensajes de error
  isAuthenticated: boolean = false; // Bandera para verificar si ya está autenticado

  constructor(private router: Router, private sqliteService: SqliteService, private modalController: ModalController, private http: HttpClient) {
    this.loadUserFromLocalStorage(); // Cargar datos de usuario si existen en localStorage
  }

  ngOnInit() {
    this.checkIfAuthenticated(); // Verificar si el usuario ya está logueado
  }

  // Función para verificar si el usuario está autenticado
  checkIfAuthenticated() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isAuthenticated = true;
      // Si ya está autenticado, redirigir al home
      let navigationExtras: NavigationExtras = {
        state: { user: this.user }
      };
      this.router.navigate(['/home'], navigationExtras);
    }
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
    this.errorMessage = ''; // Resetear el mensaje de error
    if (this.isPasswordValid(this.user.password)) {
      const token = this.sqliteService.login(this.user.usuario, this.user.password);
      if (token) {
        localStorage.setItem('auth_token', token); // Guardar el token en localStorage
        this.saveUserToLocalStorage(); // Guardar el usuario
        let navigationExtras: NavigationExtras = {
          state: { user: this.user }
        };
        this.router.navigate(['/home'], navigationExtras);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos'; // Mensaje de error
        this.passwordValid = false; // Indica que la validación falló
      }
    } else {
      this.errorMessage = 'Contraseña no cumple los requisitos'; // Mensaje de error para contraseña inválida
      this.passwordValid = false; // Indica que la validación falló
    }
  }

  async registrar() {
    this.errorMessage = ''; // Resetear el mensaje de error
    if (this.isPasswordValid(this.user.password)) {
      const userCreated = await this.sqliteService.createUser(this.user.usuario, this.user.password); 
      if (userCreated) {
        this.errorMessage = 'Usuario registrado correctamente'; // Mensaje de éxito
        this.saveUserToLocalStorage(); // Guardar el usuario registrado en localStorage
        // Redirigir al home después del registro si deseas
        let navigationExtras: NavigationExtras = {
          state: { user: this.user }
        };
        this.router.navigate(['/home'], navigationExtras);
      } else {
        this.errorMessage = 'El usuario ya existe'; // Mostrar mensaje de error si el usuario ya está registrado
      }
    } else {
      this.errorMessage = 'Contraseña no cumple los requisitos'; // Mensaje de error para contraseña inválida
      this.passwordValid = false;
    }
  }

  isPasswordValid(password: string): boolean {
    // Regex para al menos 4 números, 3 caracteres alfanuméricos/especiales, y 1 mayúscula
    const regex = /^(?=(?:.*\d){4})(?=(?:.*[a-zA-Z]){3})(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  }

  // Método de cierre de sesión
async cerrarSesion() {
  localStorage.removeItem('user'); // Elimina el usuario de localStorage
    localStorage.removeItem('auth_token'); // Elimina el token de autenticación
    this.isAuthenticated = false; // Actualiza la bandera de autenticación
  this.sqliteService.logout(); // Llamar al método de cierre de sesión del servicio
  this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
}

 // Método para verificar la conexión al JSON Server
 async checkServerConnection() {
  this.http.get('http://192.168.4.97:3000/').subscribe(
    (data) => {
      console.log('Datos obtenidos del JSON Server:', data);
      alert('Datos obtenidos: ' + JSON.stringify(data));
    },
    (error) => {
      console.error('Error al conectarse al JSON Server', error);
      alert('No se pudo conectar al JSON Server');
    }
  );
}

}
