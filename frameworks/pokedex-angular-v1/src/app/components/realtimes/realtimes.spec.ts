import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Realtimes } from './realtimes';

describe('Realtimes', () => {
  let component: Realtimes;
  let fixture: ComponentFixture<Realtimes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Realtimes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Realtimes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
