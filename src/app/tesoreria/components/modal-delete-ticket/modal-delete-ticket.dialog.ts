import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Ticket } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { HelpersService } from '../../../core/services/helpers.service';

@Component({
  selector: 'app-modal-delete-ticket',
  templateUrl: './modal-delete-ticket.dialog.html',
  styleUrls: ['./modal-delete-ticket.dialog.scss']
})
export class ModalDeleteTicketDialog implements OnInit {

  public user!: User;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket },
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
