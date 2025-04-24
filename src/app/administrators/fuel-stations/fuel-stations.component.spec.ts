import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStationsComponent } from './fuel-stations.component';

describe('FuelStationsComponent', () => {
  let component: FuelStationsComponent;
  let fixture: ComponentFixture<FuelStationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuelStationsComponent],
    });
    fixture = TestBed.createComponent(FuelStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
