import { CanActivateFn } from '@angular/router';

export const noIngresadoGuard: CanActivateFn = (route, state) => {
  return true;
};
