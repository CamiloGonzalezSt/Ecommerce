import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEnviadoComponent } from '../modal-enviado/modal-enviado.component';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {

  constructor(public modalController: ModalController) { }
  async mostrarModal() {
    const modal = await this.modalController.create({
      component: ModalEnviadoComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  ngOnInit() {
  }

}
