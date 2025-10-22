import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFullActions } from './table-full-actions';

describe('TableFullActions', () => {
  let component: TableFullActions;
  let fixture: ComponentFixture<TableFullActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFullActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableFullActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
