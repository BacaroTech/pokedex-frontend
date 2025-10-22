import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tabletest } from './tabletest';

describe('Tabletest', () => {
  let component: Tabletest;
  let fixture: ComponentFixture<Tabletest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabletest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tabletest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
