import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AdministratorsService } from '../../administrators.service';
import { StationEntity } from 'src/app/core/dtos/database-schema';

@Component({
  selector: 'app-add-station',
  templateUrl: './add-station.component.html',
  styleUrls: ['./add-station.component.scss'],
})
export class AddStationComponent implements OnInit {
  @Input() set station(item: StationEntity) {
    if (item) {
      this.stationId = item.id;
      this.selectedStation = item;
      this.updateForm.patchValue(item);

      this.loadCities();
    }
  }

  @Output() saving = new EventEmitter<boolean>();

  states: any[];
  cities: any[];
  stationId: number;
  updateForm: FormGroup;
  selectedStation: StationEntity;

  constructor(private service: AdministratorsService, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      stateId: this.fb.control(null, [Validators.required]),
      cityId: this.fb.control(null, [Validators.required]),
      address: this.fb.control('', [Validators.required]),
      lat: this.fb.control(0, [Validators.required]),
      lng: this.fb.control(0, [Validators.required]),
      name: this.fb.control(''),
      number: this.fb.control('', [Validators.required]),
      identifier: this.fb.control('', [Validators.required]),
      customerId: this.fb.control(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadStates();
  }

  onClose(): void {
    this.saving.emit(false);
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      return;
    }

    this.service.addStation(this.updateForm.value).subscribe((response) => {
      this.saving.emit(true);
    });
  }

  loadCities(): void {
    const stateId = this.updateForm.value.stateId;

    this.service.cities(stateId).subscribe(
      (response) => {
        this.cities = <any[]>response.data || [];
      },
      (err) => {
        this.cities = [];
      }
    );
  }

  private loadStates(): void {
    this.service.states().subscribe(
      (response) => {
        this.states = <any[]>response.data || [];
      },
      (err) => {
        this.states = [];
      }
    );
  }
}
