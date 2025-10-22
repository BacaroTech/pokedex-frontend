import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Foldertree } from './foldertree';

describe('Foldertree', () => {
  let component: Foldertree;
  let fixture: ComponentFixture<Foldertree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foldertree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Foldertree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
