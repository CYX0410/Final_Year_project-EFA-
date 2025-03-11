import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoproductPage } from './ecoproduct.page';

describe('EcoproductPage', () => {
  let component: EcoproductPage;
  let fixture: ComponentFixture<EcoproductPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
