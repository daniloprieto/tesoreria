import { Component, Input } from '@angular/core';
import { distinctUntilChanged, tap } from 'rxjs';
import { Ticket } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { TicketService } from '../../../core/services/ticket.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalDeleteTicketDialog } from '../modal-delete-ticket/modal-delete-ticket.dialog';
import { HelpersService, STATUS, TYPE } from '../../../core/services/helpers.service';
import { AlertService } from '../../../core/services/alert.service';

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
    private _helpers: HelpersService,
    private _alert: AlertService
  ) {
    this.retrieveTickets();
    this.todayEs = this._helpers.todayEsStr();
    this.todayEn = this._helpers.todayEnStr();
  }

  retrieveTickets(date: any = this.todayEn) {

    let utc = this._helpers.utcSlice(date);

    this._ticket.getTicketsForDate(utc)
      .pipe(
        distinctUntilChanged(),
        tap(
          {
            next: (tickets) => {
              if (tickets.length > 0) this.tickets = this._helpers.getActiveTickets(tickets)
            },
            error: (error) => {
              console.error(error);
              this._alert.showAlert('Error al recuperar la lista de tickets');
            }
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
      data: { ticket }
    }).afterClosed().subscribe(
      (res: boolean) => { if (res) this.cancelTicket(ticket) } );

  }

  getTotalAmount(): number {
    return this._helpers.getTotalActives(this.tickets);
  }

  cancelTicket(ticket: Ticket) {
    this._ticket.cancelTicket(ticket).pipe(
      tap(
        {
          error: (error) => {
            console.error(error);
            this._alert.showAlert('No es posible anular el ticklet Nº' + ticket.id);
          }
        }
      )
    ).subscribe()
  }

  isCrossed(ticket: Ticket):string {
    if (Number(ticket.status) === STATUS.ACTIVED && ticket.type === TYPE.EGRESS) {
      return 'egress';
    } else if (Number(ticket.status) === 1 && (ticket.type === TYPE.INGRESS || ticket.type === TYPE.TITHE || ticket.type === TYPE.OFFERING)) {
      return 'ingress';
    } else {
      return 'crossed';
    }
  }

  show(tickets: Ticket[]) {
    const availableTickets = this._helpers.getActiveTickets(tickets);
    return availableTickets.length > 0 ? true : false;
  }

  isCanceled(status:number): boolean{
    return +status === STATUS.CANCEL ? true : false;
  }

}
