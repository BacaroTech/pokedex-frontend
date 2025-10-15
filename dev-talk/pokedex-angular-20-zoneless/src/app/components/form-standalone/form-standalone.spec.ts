import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStandalone } from './form-standalone';

describe('FormStandalone', () => {
  let component: FormStandalone;
  let fixture: ComponentFixture<FormStandalone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStandalone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStandalone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
