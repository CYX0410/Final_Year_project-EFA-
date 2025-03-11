import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoChallengesPage } from './eco-challenges.page';

describe('EcoChallengesPage', () => {
  let component: EcoChallengesPage;
  let fixture: ComponentFixture<EcoChallengesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoChallengesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
