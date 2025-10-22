import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fiftyanimations } from './fiftyanimations';

describe('Fiftyanimations', () => {
  let component: Fiftyanimations;
  let fixture: ComponentFixture<Fiftyanimations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fiftyanimations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fiftyanimations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
