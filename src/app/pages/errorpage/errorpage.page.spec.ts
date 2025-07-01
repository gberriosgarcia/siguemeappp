import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorpagePage } from './errorpage.page';

describe('ErrorpagePage', () => {
  let component: ErrorpagePage;
  let fixture: ComponentFixture<ErrorpagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
