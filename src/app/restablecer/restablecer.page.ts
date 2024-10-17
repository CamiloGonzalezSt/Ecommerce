import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEnviadoComponent } from '../modal-enviado/modal-enviado.component';
import { SqliteService } from '../services/sqlite.service'; // Asegúrate de importar tu servicio
import { User } from '../producto/model/user';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {
  usuarioOContrasenaAntigua: string = ''; // Almacena el nombre de usuario o la contraseña antigua
  nuevaContrasena: string = ''; // Almacena la nueva contraseña
  mensajeValidacion: string = ''; // Mensaje de validación para el usuario

  constructor(public modalController: ModalController, private sqliteService: SqliteService) { }

  async mostrarModal(mensaje: string) {
    const modal = await this.modalController.create({
      component: ModalEnviadoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        mensaje: mensaje
      }
    });
    return await modal.present();
  }
  ngOnInit() {
  }

  validarContrasena(password: string): boolean {
    // Regex para al menos 4 números, 3 caracteres alfanuméricos/especiales, y 1 mayúscula
    const regex = /^(?=(?:.*\d){4})(?=(?:.*[a-zA-Z]){3})(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  }

  async cambiarContrasena() {
    // Lógica para cambiar la contraseña
    const usuarios = this.sqliteService.getUsers();
    
    const usuarioEncontrado = usuarios.find(user => 
      user.usuario === this.usuarioOContrasenaAntigua || user.password === this.usuarioOContrasenaAntigua
    );

    if (usuarioEncontrado) {
      // Validar la nueva contraseña
      if (this.validarContrasena(this.nuevaContrasena)) {
        // Cambia la contraseña
        usuarioEncontrado.password = this.nuevaContrasena;
        this.sqliteService.updateUser(usuarioEncontrado); // Actualiza en SQLite
        
        // Sincroniza con JSON Server (implementa tu lógica aquí)
        await this.sincronizarConJsonServer(usuarioEncontrado); // Asegúrate de implementar este método

        await this.mostrarModal('Contraseña cambiada con éxito'); // Mostrar modal de éxito
      } else {
        this.mensajeValidacion = 'La nueva contraseña debe tener al menos 4 números, 3 letras y 1 mayúscula.';
      }
    } else {
      // Mostrar mensaje de error si el usuario no es encontrado
      await this.mostrarModal('Usuario o contraseña antigua incorrectos');
    }
  }

  async sincronizarConJsonServer(usuario: any) {
    // Implementa la lógica para sincronizar con JSON Server
    // Por ejemplo, puedes usar HttpClient para enviar una solicitud PUT
    // Asegúrate de manejar la promesa y la respuesta adecuadamente
  }
}
