import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-update-profile-photo',
  templateUrl: './update-profile-photo.component.html',
  styleUrls: ['./update-profile-photo.component.scss'],
})
export class UpdateProfilePhotoComponent {
  profilePhoto: string | null = null;

  constructor(private modalCtrl: ModalController, private dbService: SqliteService) { }

  async selectPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    this.profilePhoto = `data:image/jpeg;base64,${image.base64String}`;
  }

  async savePhoto() {
    if (this.profilePhoto) {
      await this.dbService.updateProfilePhoto(this.profilePhoto);
      this.dismiss(this.profilePhoto);
    }
  }

  dismiss(data: any = null) {
    this.modalCtrl.dismiss(data);
  }

}
