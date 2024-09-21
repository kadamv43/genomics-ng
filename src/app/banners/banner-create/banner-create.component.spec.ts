import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerCreateComponent } from './banner-create.component';

describe('BannerCreateComponent', () => {
  let component: BannerCreateComponent;
  let fixture: ComponentFixture<BannerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
