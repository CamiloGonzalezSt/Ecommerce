import { Component } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { ModalController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.page.html',
  styleUrls: ['./client-profile.page.scss'],
})
export class ClientProfilePage {
  username: string = '';

  constructor(private dbService: SqliteService,private navCtrl: NavController) { }

  async loadUserProfile() {
    const user = await this.dbService.getCurrentUser();
    this.username = user?.username || 'Usuario';
  }

  

  goBack() {
    this.navCtrl.back();
  }

}
