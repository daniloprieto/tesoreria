import { Component, Input, OnInit } from '@angular/core';
import { distinctUntilChanged, tap } from 'rxjs';
import { Ticket } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { TicketService } from '../../../core/services/ticket.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalDeleteTicketDialog } from '../modal-delete-ticket/modal-delete-ticket.dialog';


@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})


export class TicketsListComponent implements OnInit {
  @Input() user!: User;
  public tickets: Ticket[] = [];
  public dNow = new Date();

  constructor(
    private _ticket: TicketService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveOrders();
  }

  retrieveOrders(date: any = this.dNow) {

    let utc = new Date(date).toJSON().slice(0, 10);

    this._ticket.getTicketsForDate(utc)
      .pipe(
        distinctUntilChanged(),
        tap(
          {
            next: (tickets) => { if (tickets.length > 0) this.tickets = tickets },
            error: (error) => { console.error(error) }
          }
        )
      ).subscribe()

  }

  getType(type: string): string {
    switch (type) {
      case 'tithe':
        return this.user.language === 'ES' ? 'Diezmo' : 'Dízimo';
        break;
      case 'offering':
        return this.user.language === 'ES' ? 'Ofrenda' : 'Oferta';
        break;
      default:
        return this.user.language === 'ES' ? 'Otro' : 'Outro';
        break;
    }
  }

  openPopup(ticket: Ticket) {
    const dialogRef = this._dialog.open(ModalDeleteTicketDialog, {
      width: '250px',
      data:{ ticket }
    });
  }

}
