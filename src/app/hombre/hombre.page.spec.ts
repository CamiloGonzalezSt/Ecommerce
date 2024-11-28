import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HombrePage } from './hombre.page';

describe('HombrePage', () => {
  let component: HombrePage;
  let fixture: ComponentFixture<HombrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HombrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
