import { Component, Input } from '@angular/core';
import { distinctUntilChanged, tap } from 'rxjs';
import { Ticket } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { TicketService } from '../../../core/services/ticket.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalDeleteTicketDialog } from '../modal-delete-ticket/modal-delete-ticket.dialog';
import { HelpersService } from '../../../core/services/helpers.service';

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
  public todayEs!: string;
  displayedColumns = ['id', 'name', 'type', 'amount','action'];

  constructor(
    private _ticket: TicketService,
    private _dialog: MatDialog,
    private _helpers: HelpersService
  ) {
    this.retrieveOrders();
    this.todayEs = this._helpers.todayEsStr();
    this.todayEn = this._helpers.todayEnStr();
  }

  retrieveOrders(date: any = this.todayEn) {

    let utc = this._helpers.utcSlice(date);

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
    return this._helpers.getType(type, this.user.language);
  }

  openPopup(ticket: Ticket) {
    const dialogRef = this._dialog.open(ModalDeleteTicketDialog, {
      width: '250px',
      data:{ ticket }
    });
  }

  getTotalCost(): number {
    return this.tickets.map(t => Number(t.amount)).reduce((acc, value) => acc + value, 0);
  }

}
