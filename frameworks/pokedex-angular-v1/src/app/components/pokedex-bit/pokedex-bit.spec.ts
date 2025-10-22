import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexBit } from './pokedex-bit';

describe('PokedexBit', () => {
  let component: PokedexBit;
  let fixture: ComponentFixture<PokedexBit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexBit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexBit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
