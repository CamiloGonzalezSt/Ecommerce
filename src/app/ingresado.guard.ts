import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { SqliteService } from './services/sqlite.service';

@Injectable({
  providedIn: 'root',
})

export class ingresadoGuard implements CanActivate {
  constructor(private router: Router, private sqliteService: SqliteService) {}

  async canActivate( 
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    
    // Verificar si el usuario está autenticado en localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated) {
      // Verificar si el usuario está en la base de datos (opcional, si usas SQLite)
      const user = await this.sqliteService.getCurrentUser();
      
      if (user) {
        // Si el usuario está autenticado y existe en la base de datos, permitir la navegación
        return true;
      } else {
        // Si el usuario no está en la base de datos, redirigir al login
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
