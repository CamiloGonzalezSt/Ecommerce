import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, CanActivate } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  user = {
    usuario: "",
    password: ""
  };

  constructor(private router : Router) { }

  ingresar(){
    if (this.user.usuario && this.user.password){
      this.router.navigate(['/home'], { queryParams: { usuario: this.user.usuario, password: this.user.password } });
    } else {
      alert('por favor ingresa un usuario y contraseña')
    }
    }
  }


