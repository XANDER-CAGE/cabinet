import { Component, Input, OnInit } from '@angular/core';

import { DiscountEntity } from '../../../core/dtos/database-schema';

@Component({
  selector: 'app-fuel-discounts',
  templateUrl: './fuel-discounts.component.html',
  styleUrls: ['./fuel-discounts.component.scss'],
})
export class FuelDiscountsComponent implements OnInit {
  @Input('items') discounts: DiscountEntity[] = [];

  ngOnInit(): void {}
}
