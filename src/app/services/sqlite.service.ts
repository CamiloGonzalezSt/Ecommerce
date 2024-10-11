import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private users = [
    { usuario: 'camilo gonzalez', password: 'Cami3740' },
    { usuario: 'alexander patiño', password: 'Alex2024' },
  ];
  
  private authenticated: boolean = false;

  getUsers() {
    return this.users;
  }

  // Método para simular la autenticación
  isAuthenticated(): boolean {
    return this.authenticated;
  }

  // Método para verificar credenciales
  login(usuario: string, password: string): boolean {
    const user = this.users.find(u => u.usuario === usuario && u.password === password);
    if (user) {
      this.authenticated = true; // Establece el estado de autenticación
      return true;
    }
    return false;
  }

  // Método para cerrar sesión
  logout() {
    this.authenticated = false; // Resetea el estado de autenticación
  }
}
