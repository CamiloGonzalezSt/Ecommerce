import { Component } from '@angular/core';
import { ActionSheetController, MenuController } from '@ionic/angular'; // Asegúrate de importar MenuController
import { register } from 'swiper/element/bundle';
import { SqliteService } from './services/sqlite.service';
import { Router } from '@angular/router';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  presentingElement: HTMLElement | undefined;
  subMenuOpen: boolean = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private menuCtrl: MenuController, // Inyectamos el MenuController
    private service: SqliteService,
    private router: Router
  ) {

    this.initializeApp();
  }

  async initializeApp() {
    await this.service.init();
  }

  toggleSubMenu() {
    this.subMenuOpen = !this.subMenuOpen;
  }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page') as HTMLElement;
  }

  // Método para cerrar el menú después de navegar
  closeMenu() {
    this.menuCtrl.close();
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
            this.service.logout();
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
