import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';

register();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  presentingElement: HTMLElement | undefined;

  constructor(private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page') as HTMLElement;
  }

  async presentLogoutConfirmation() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿Estás seguro de cerrar sesión?',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Sí, cerrar sesión',
          role: 'destructive',
          handler: () => {
            window.location.href = '/login';
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // No hacer nada, solo cerrar el ActionSheet
          }
        }
      ]
    });

    await actionSheet.present();
  }
}