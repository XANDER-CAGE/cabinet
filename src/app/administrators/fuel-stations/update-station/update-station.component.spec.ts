import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStationComponent } from './update-station.component';

describe('UpdateStationComponent', () => {
  let component: UpdateStationComponent;
  let fixture: ComponentFixture<UpdateStationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStationComponent],
    });
    fixture = TestBed.createComponent(UpdateStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
