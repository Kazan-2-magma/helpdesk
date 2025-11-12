import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFaqs } from './admin-faqs';

describe('AdminFaqs', () => {
  let component: AdminFaqs;
  let fixture: ComponentFixture<AdminFaqs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFaqs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFaqs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
