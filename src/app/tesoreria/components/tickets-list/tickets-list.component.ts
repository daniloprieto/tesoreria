import { Component, Input } from '@angular/core';
import { tap, BehaviorSubject, Subscription, distinct } from 'rxjs';
import { Ticket } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { TicketService } from '../../../core/services/ticket.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalDeleteTicketDialog } from '../modal-delete-ticket/modal-delete-ticket.dialog';
import { HelpersService, STATUS, TYPE } from '../../../core/services/helpers.service';
import { AlertService } from '../../../core/services/alert.service';
import { PrintService } from '../../../core/services/print.service';

export interface Transaction {
  item: string;
  cost: number;
}
@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})

export class TicketsListComponent {
  @Input() user!: User;
  public tickets: Ticket[] = [];
  public todayEn!: string;

  private _sub$: Subscription[] = [];

  constructor(
    private _ticket: TicketService,

    private _helpers: HelpersService,
    private _alert: AlertService
  ) {
    this.retrieveTickets();
    this.todayEn = this._helpers.dateEnStr();
  }

  retrieveTickets(date: any = this.todayEn) {

    let utc = this._helpers.utcSlice(date);

    this._sub$.push(
      this._ticket.getTicketsForDate(utc)
        .pipe(
          distinct(),
          tap(
            {
              next: (tickets) => {
                if (tickets.length > 0) this.tickets = this._helpers.getActiveTickets(tickets);
              },
              error: (error) => {
                console.error(error);
                this._alert.showAlert('Error al recuperar la lista de tickets');
              }
            }
          )
      ).subscribe()
    );

  }

}
