import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFullDocumentsComponent } from './show-full-documents.component';

describe('ShowFullDocumentsComponent', () => {
  let component: ShowFullDocumentsComponent;
  let fixture: ComponentFixture<ShowFullDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowFullDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowFullDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
