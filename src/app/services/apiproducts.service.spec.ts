import { TestBed } from '@angular/core/testing';

import { ApiproductsService } from './apiproducts.service';

describe('ApiproductsService', () => {
  let service: ApiproductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiproductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
