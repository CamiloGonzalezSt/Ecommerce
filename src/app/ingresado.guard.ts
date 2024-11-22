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

    const user = await this.sqliteService.getCurrentUser(); 
    if (user && user.isAdmin) {
      return true; 
    } else {
      this.router.navigate(['/login']); // Redirigir a la página de inicio si no es admin
      return false; 
    }
  }
}
