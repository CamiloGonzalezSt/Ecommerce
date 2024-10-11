import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noIngresadoGuard } from './no-ingresado.guard';

describe('noIngresadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noIngresadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
