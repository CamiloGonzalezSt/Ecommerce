import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isAdmin: number = 0;
  isLoading = false;


  constructor(private router: Router, private sqliteService: SqliteService, private loadingCtrl: LoadingController) {

  }

 

  ionViewWillEnter() {
    this.clearInputs(); 
  }

  clearInputs() {
    this.username = '';
    this.password = '';
  }



  async login() {
    this.showLoading();
    const result = await this.sqliteService.login(this.username, this.password);

    if (!result.success) {
      this.errorMessage = 'Credenciales inválidas';
    }
    this.isLoading = false;
  }


  public onResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  public goToRegister() {
    console.log('Navegando a registro');
    this.router.navigate(['/register']);
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      duration: 500,
    });

    loading.present();
  }



}
