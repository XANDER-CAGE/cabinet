import { Component, OnInit } from '@angular/core';

import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  onLogout(): void {
    this.auth.logOut();
  }
}
