import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyHttpSignals } from './case-study-http-signals';

describe('CaseStudyHttpSignals', () => {
  let component: CaseStudyHttpSignals;
  let fixture: ComponentFixture<CaseStudyHttpSignals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudyHttpSignals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseStudyHttpSignals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
