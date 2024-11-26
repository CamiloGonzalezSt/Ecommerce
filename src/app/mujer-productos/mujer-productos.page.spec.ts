import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MujerProductosPage } from './mujer-productos.page';

describe('MujerProductosPage', () => {
  let component: MujerProductosPage;
  let fixture: ComponentFixture<MujerProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MujerProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
