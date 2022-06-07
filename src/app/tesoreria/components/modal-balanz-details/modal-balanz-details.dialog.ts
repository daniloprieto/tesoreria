import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Ticket } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { HelpersService } from '../../../core/services/helpers.service';

@Component({
  selector: 'app-modal-balanz-details',
  templateUrl: './modal-balanz-details.dialog.html',
  styleUrls: ['./modal-balanz-details.dialog.scss']
})
export class ModalBalanzDetailsDialog implements OnInit {

  public user!: User;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tickets: Ticket[] },
    private _auth: AuthService,
    private _helpers: HelpersService
  ) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user => this.user = user);
  }

  getType(type: string): string {
    return this._helpers.getType(type, this.user.language)
  }

}
