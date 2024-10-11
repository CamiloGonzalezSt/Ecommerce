import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Injectable } from '@angular/core';
import { SqliteService } from './services/sqlite.service';

@Injectable({
  providedIn: 'root',
})

export class ingresadoGuard implements CanActivate{
  constructor(private router: Router, private sqliteService: SqliteService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.sqliteService.isAuthenticated(); // Cambia esto según tu lógica de autenticación

    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirige a la página de login si no está autenticado
      return false;
    }
    return true;
  }
}