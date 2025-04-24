import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelDiscountsComponent } from './fuel-discounts.component';

describe('FuelDiscountsComponent', () => {
  let component: FuelDiscountsComponent;
  let fixture: ComponentFixture<FuelDiscountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuelDiscountsComponent]
    });
    fixture = TestBed.createComponent(FuelDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
