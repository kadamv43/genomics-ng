import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactDetailsComponent } from './edit-contact-details.component';

describe('EditContactDetailsComponent', () => {
  let component: EditContactDetailsComponent;
  let fixture: ComponentFixture<EditContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContactDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
