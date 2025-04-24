import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStationsComponentimplements } from './fuel-stations.component';

describe('FuelStationsComponent', () => {
  let component: FuelStationsComponentimplements;
  let fixture: ComponentFixture<FuelStationsComponentimplements>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuelStationsComponentimplements],
    });
    fixture = TestBed.createComponent(FuelStationsComponentimplements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
