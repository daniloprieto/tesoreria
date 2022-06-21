import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { Ticket } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { HelpersService, STATUS, TYPE } from 'src/app/core/services/helpers.service';
import { PrintService } from 'src/app/core/services/print.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { ModalDeleteTicketDialog } from 'src/app/tesoreria/components/modal-delete-ticket/modal-delete-ticket.dialog';

@Component({
  selector: 'app-tickets-table',
  templateUrl: './tickets-table.component.html',
  styleUrls: ['./tickets-table.component.scss']
})
export class TicketsTableComponent implements OnInit {
  @Input() tickets!: Ticket[];
  @Input() user!: User;
  @Input() buttons: string[] = ['print', 'delete'];

  displayedColumns = ['id', 'name', 'type', 'amount', 'action'];
  public showTable = new BehaviorSubject<boolean>(false);
  public dayEs = this._helpers.dateEsStr();
  private _sub$: Subscription[] = [];

  constructor(
    private _ticket: TicketService,
    private _print: PrintService,
    private _dialog: MatDialog,
    private _helpers: HelpersService,
    private _alert: AlertService
  ) { }

  ngOnInit(): void {
    this.showTable.next(this.tickets.length > 0 ? true : false);
    this.dayEs = this._helpers.dateEsStr(new Date(this.tickets[0].createdAt));
  }

  rePrint(ticket: Ticket) {
    this._print.print('designTicket', [ticket])
  }

  getType(type: string): string {
    return this._helpers.getType(type, this.user.language);
  }

  openPopup(ticket: Ticket) {
    this._sub$.push(
      this._dialog.open(ModalDeleteTicketDialog, {
        width: '250px',
        data: { ticket }
      })
        .afterClosed()
        .subscribe((res: boolean) => { if (res) this.cancelTicket(ticket) })
    );

  }

  getTotalAmount(): number {
    return this._helpers.getTotalActives(this.tickets);
  }

  cancelTicket(ticket: Ticket) {
    this._sub$.push(
      this._ticket.cancelTicket(ticket).pipe(
        tap(
          {
            error: (error) => {
              console.error(error);
              this._alert.showAlert($localize `No es posible anular el ticklet Nº${ticket.id}`);
            }
          }
        )
      ).subscribe()
    );
  }

  isCrossed({status, type}: Ticket): string {

    if (+status! === STATUS.ACTIVED || +status! === STATUS.CLOSED || +status! === STATUS.REPORTED) {
      if ( type === TYPE.EGRESS) {
        return 'egress';
      } else if (type === TYPE.INGRESS || type === TYPE.TITHE || type === TYPE.OFFERING) {
        return 'ingress';
      } else {
        return '';
      }
    }else if (+status! === STATUS.CANCEL) {
      return 'crossed';
    } else {
      return '';
    }
  }

  isCanceled(status:number): boolean{
    return +status === STATUS.CANCEL ? true : false;
  }

  showBtn(name: string): boolean{
    let result = this.buttons.find(btn => btn === name);
    return result && result.length > 0 ? true : false;
  }

  ngOnDestroy(): void {
    this._sub$.map((sub) => sub.unsubscribe());
  }

}
