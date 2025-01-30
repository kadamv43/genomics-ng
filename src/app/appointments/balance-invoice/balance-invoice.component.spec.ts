import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceInvoiceComponent } from './balance-invoice.component';

describe('BalanceInvoiceComponent', () => {
  let component: BalanceInvoiceComponent;
  let fixture: ComponentFixture<BalanceInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BalanceInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
