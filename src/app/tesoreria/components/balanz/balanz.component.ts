import { Component, OnInit } from '@angular/core';
import { Report, Ticket } from '../../../core/models/ticket.model';
import { TicketService } from '../../../core/services/ticket.service';
import { HelpersService } from '../../../core/services/helpers.service';
import { MatDialog } from '@angular/material/dialog';
import { distinct, Subscription, tap } from 'rxjs';
import { AlertService } from '../../../core/services/alert.service';
import { ModalBalanzDetailsDialog } from '../modal-balanz-details/modal-balanz-details.dialog';

@Component({
  selector: 'app-balanz',
  templateUrl: './balanz.component.html',
  styleUrls: ['./balanz.component.scss']
})
export class BalanzComponent implements OnInit {

  public reports!: Report[];
  private _sub$: Subscription[] = [];

  constructor(
    private _tickets: TicketService,
    private _dialog: MatDialog,
    private _helpers: HelpersService,
    private _ticket: TicketService,
    private _alert: AlertService
  ) { }

  ngOnInit(): void {
    this._tickets.getCashClosingReports().subscribe(
      (reports) => {
        this.reports = reports.sort((a, b) => {
          const idA = a?.id ?? 0; // Si a.id es undefined, usa 0 como valor predeterminado
          const idB = b?.id ?? 0; // Si b.id es undefined, usa 0 como valor predeterminado
          return idB - idA; // Ordenar de mayor a menor
        });
      }
    );
  }

  getDate(d:any): string {
    const date = new Date(d);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  openReport(report: Report) {

    this.retrieveTickets(report.createdAt)

  }

  retrieveTickets(date: any) {

    let d = this._helpers.dateEnStr( new Date(date));
    let utc = this._helpers.utcSlice(new Date(d));

    this._sub$.push(
      this._ticket.getTicketsForDate(utc)
        .pipe(
          distinct(),
          tap(
            {
              next: (tickets) => { if(tickets.length > 0) this.openPopup(tickets)},
              error: (error) => {
                console.error(error);
                this._alert.showAlert('Error al recuperar la lista de tickets');
              }
            }
          )
      ).subscribe()
    );

  }

  openPopup(tickets: Ticket[]) {
    this._sub$.push(
      this._dialog.open(ModalBalanzDetailsDialog, {
      data: { tickets }
      })
        .afterClosed()
        .subscribe()
    );

  }

  ngOnDestroy(): void {
    this._sub$.map(sub => sub.unsubscribe());
  }


}
