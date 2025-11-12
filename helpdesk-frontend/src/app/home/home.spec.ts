import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCompenent } from './home';

describe('Home', () => {
  let component: HomeCompenent;
  let fixture: ComponentFixture<HomeCompenent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCompenent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCompenent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
