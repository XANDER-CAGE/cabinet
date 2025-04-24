import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountFilesComponent } from './discount-files.component';

describe('DiscountFilesComponent', () => {
  let component: DiscountFilesComponent;
  let fixture: ComponentFixture<DiscountFilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountFilesComponent],
    });
    fixture = TestBed.createComponent(DiscountFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
