import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Ticket } from 'src/app/core/models/ticket.model';

@Component({
  selector: 'app-modal-delete-ticket',
  templateUrl: './modal-delete-ticket.dialog.html',
  styleUrls: ['./modal-delete-ticket.dialog.scss']
})
export class ModalDeleteTicketDialog implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket }
  ) { }

  ngOnInit(): void {
    console.log('entro al modal')
  }

}
