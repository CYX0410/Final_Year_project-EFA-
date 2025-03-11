import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcotipsPage } from './ecotips.page';

describe('EcotipsPage', () => {
  let component: EcotipsPage;
  let fixture: ComponentFixture<EcotipsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EcotipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
