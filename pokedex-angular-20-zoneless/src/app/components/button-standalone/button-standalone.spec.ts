import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonStandalone } from './button-standalone';

describe('ButtonStandalone', () => {
  let component: ButtonStandalone;
  let fixture: ComponentFixture<ButtonStandalone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonStandalone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonStandalone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
