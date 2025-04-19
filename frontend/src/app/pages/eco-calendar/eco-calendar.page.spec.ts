import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoCalendarPage } from './eco-calendar.page';

describe('EcoCalendarPage', () => {
  let component: EcoCalendarPage;
  let fixture: ComponentFixture<EcoCalendarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
