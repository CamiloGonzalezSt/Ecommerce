import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private isAdmin: number = 0;

  constructor(private router: Router) {}

 

  setAuth(isAuthenticated: boolean, isAdmin: number) {
    this.isAuthenticated = isAuthenticated;
    this.isAdmin = isAdmin;
  }
  
  getCurrentUser() {
    return { isAdmin: this.isAdmin };
  }

  getAuthStatus() {
    return { isAuthenticated: this.isAuthenticated, isAdmin: this.isAdmin };
  }

  isUserAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin === 1; 
  }

  logout() {
    this.isAuthenticated = false;
    this.isAdmin = 1;

    // Si tienes un almacenamiento local o cookies, puedes limpiar los datos aquí
    // Ejemplo con localStorage (si guardas alguna sesión)
    // localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}
