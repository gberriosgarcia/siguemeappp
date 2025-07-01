import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewuserPage } from './previewuser.page';

describe('PreviewuserPage', () => {
  let component: PreviewuserPage;
  let fixture: ComponentFixture<PreviewuserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
