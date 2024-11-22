import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  mail: string = '';
  isLoading = false;

  constructor(    private router: Router,
    @Inject(SqliteService) private dbService: SqliteService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

    async onResetPassword() {
      if (!this.mail) {
        this.showAlert('Error', 'Por favor ingresa un correo válido.');
        return;
      }
  
      try {
        // Verificar si el correo existe en la base de datos
        const user = await this.dbService.findUserByEmail(this.mail);
        if (user) {
          // Simulación del envío de correo
          console.log(`Correo enviado a ${this.mail}.`);
          await this.showAlert(
            'Éxito',
            `Se ha enviado un correo de recuperación a ${this.mail}.`
          );
          this.router.navigate(['/login']);
        } else {
          await this.showAlert(
            'Error',
            'El correo electrónico no está registrado.'
          );
        }
      } catch (error) {
        console.error(error);
        await this.showAlert('Error', 'Ha ocurrido un problema. Intenta de nuevo.');
      }
    }
  
  
    async showAlert(header: string, message: string) {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: ['OK'],
      });
      await alert.present();
    }

}
