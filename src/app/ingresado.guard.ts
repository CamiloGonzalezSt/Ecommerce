import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SqliteService } from './services/sqlite.service';

@Injectable({
  providedIn: 'root',
})

export class ingresadoGuard implements CanActivate {
  constructor(private router: Router, private sqliteService: SqliteService) {}

  canActivate(): boolean {
    // Verifica si hay un token almacenado en localStorage
    const token = localStorage.getItem('auth_token');

    // Verifica si el usuario está autenticado con SqliteService
    const isAuthenticatedSqlite = this.sqliteService.isAuthenticated();

    if (token && isAuthenticatedSqlite) {
      
      return true;
    } else {
      
      this.router.navigate(['/login']);
      return false;
    }
  }
}
