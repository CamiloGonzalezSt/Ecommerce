import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-enviado',
  templateUrl: './modal-enviado.component.html',
  styleUrls: ['./modal-enviado.component.scss'],
})
export class ModalEnviadoComponent  implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    setTimeout(() => {
      this.modalController.dismiss();
    }, 2000); // El modal se cerrará después de 2 segundos
  }

}
