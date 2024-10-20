import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-enviado',
  templateUrl: './modal-enviado.component.html',
  styleUrls: ['./modal-enviado.component.scss'],
})
export class ModalEnviadoComponent  implements OnInit {


  constructor(public modalController: ModalController) { }
  @Input()
  mensaje!: string;

  ngOnInit() {
    setTimeout(() => {
      this.modalController.dismiss();
    }, 1000); // El modal se cerrará después de 1 segundos
  }

}
