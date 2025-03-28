import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutEfaPage } from './about-efa.page';

describe('AboutEfaPage', () => {
  let component: AboutEfaPage;
  let fixture: ComponentFixture<AboutEfaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutEfaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
