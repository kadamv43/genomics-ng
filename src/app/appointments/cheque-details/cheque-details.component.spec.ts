import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeDetailsComponent } from './cheque-details.component';

describe('ChequeDetailsComponent', () => {
  let component: ChequeDetailsComponent;
  let fixture: ComponentFixture<ChequeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChequeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
