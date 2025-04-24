import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDriversComponent } from './manage-drivers.component';

describe('DriversComponent', () => {
  let component: ManageDriversComponent;
  let fixture: ComponentFixture<ManageDriversComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDriversComponent],
    });
    fixture = TestBed.createComponent(ManageDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
