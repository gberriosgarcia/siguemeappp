import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstaloginPage } from './instalogin.page';

describe('InstaloginPage', () => {
  let component: InstaloginPage;
  let fixture: ComponentFixture<InstaloginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
