import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';


@Component({
  selector: 'app-update-cliente',
  templateUrl: './update-cliente.component.html',
  styleUrls: ['./update-cliente.component.scss'],
})
export class UpdateClienteComponent {
  @Input() username!: string;
  password: string = '';

  constructor(private modalController: ModalController, private dbService: SqliteService) { }

  dismiss() {
    this.modalController.dismiss();
  }

  async saveChanges() {
    if (this.username && this.password) {
      await this.dbService.updateUserProfile(this.username, this.password);
      alert('Perfil actualizado correctamente');
      this.dismiss();
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }

}
