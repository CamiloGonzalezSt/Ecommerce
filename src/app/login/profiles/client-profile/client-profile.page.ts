import { Component, OnInit } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite.service';
import { ModalController, NavController } from '@ionic/angular';
import { UpdateClienteComponent } from 'src/app/modals/update-cliente/update-cliente.component';
import { UpdateUsernameClientComponent } from 'src/app/modals/update-username-client/update-username-client.component';
import { UpdatePasswordClientComponent } from 'src/app/modals/update-password-client/update-password-client.component';
import { UpdateProfilePhotoComponent } from 'src/app/modals/update-profile-photo/update-profile-photo.component';


@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.page.html',
  styleUrls: ['./client-profile.page.scss'],
})
export class ClientProfilePage  implements OnInit{
  username: string = '';
  profilePhoto: string | null = '../assets/photos/perfil.jpg';


  constructor(private dbService: SqliteService,private navCtrl: NavController, private modalController: ModalController) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const user = await this.dbService.getCurrentUser();
    this.username = user?.username || 'Usuario';
  }

  async openEditProfileModal() {
    const modal = await this.modalController.create({
      component: UpdateClienteComponent,
      componentProps: { username: this.username }
    });
    await modal.present();
  }

  async openEditUsernameModal() {
    const modal = await this.modalController.create({
      component: UpdateUsernameClientComponent, 
      componentProps: { currentUsername: this.username }
    });
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data?.updatedUsername) {
      this.username = data.updatedUsername;
    }
  }

  async openEditPasswordModal() {
    const modal = await this.modalController.create({
      component: UpdatePasswordClientComponent 
    });
    await modal.present();
  }

  async openEditPhotoModal() {
    const modal = await this.modalController.create({
      component: UpdateProfilePhotoComponent,
      componentProps: { profilePhoto: this.profilePhoto }
    });
  
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.profilePhoto = data;
    }
  }

  async deleteProfilePhoto() {
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar tu foto de perfil?');
    if (confirm) {
      await this.dbService.deleteProfilePhoto();
      this.profilePhoto = null; 
      alert('Foto de perfil eliminada correctamente.');
    }
  }
  

  goBack() {
    this.navCtrl.back();
  }

}
