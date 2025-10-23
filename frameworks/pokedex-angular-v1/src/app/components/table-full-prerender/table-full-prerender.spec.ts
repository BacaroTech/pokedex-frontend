import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFullPrerender } from './table-full-prerender';

describe('TableFullPrerender', () => {
  let component: TableFullPrerender;
  let fixture: ComponentFixture<TableFullPrerender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFullPrerender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableFullPrerender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
