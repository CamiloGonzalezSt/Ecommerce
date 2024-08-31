import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  user = {
    usuario: "",
    password: ""
  };

  passwordValid: boolean = true;

  constructor(private router : Router) { }

  ingresar() {
    if (this.isPasswordValid(this.user.password)) {
      let navigationExtras: NavigationExtras = {
        state: { user: this.user }
      };
      this.router.navigate(['/home'], navigationExtras);
    } else {
      this.passwordValid = false;
    }
  }

  isPasswordValid(password: string): boolean {
    // Regex para al menos 4 números, 3 caracteres alfanuméricos/especiales, y 1 mayúscula
    const regex = /^(?=(?:.*\d){4})(?=(?:.*[a-zA-Z]){3})(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  }
}