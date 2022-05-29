import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../../../core/services/helpers.service';
import { FormControl } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { PrintService } from '../../../core/services/print.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public todayEn!: string;
  public todayEs!: string;
  public selectedDate = new FormControl();
  public availableCashClosing = false;


  constructor(
    private _helpers: HelpersService,
    private _ticket: TicketService,
    private _print: PrintService,
    private _alert: AlertService
  ) { }

  ngOnInit(): void {
    this.todayEs = this._helpers.todayEsStr();
    this.todayEn = this._helpers.todayEnStr();
    this.selectedDate.setValue(this.todayEn);
    this._ticket.ticketsToday$.subscribe(tickets => this.availableCashClosing = tickets.length > 0 ? true : false);
  }

  retrieveOrders(event: any, date: any = this.todayEn) {
    event.preventDefault();

    let utc = new Date(date).toJSON().slice(0, 10);

    this._ticket.getTicketsForDate(utc)
      .subscribe(
        {
          next: (tickets) => {

            if (tickets.length > 0) {

              this._print.print('designReport', tickets, date);

            } else {

              this._alert.showAlert('No hay datos para imprimir')

            }
          },
          error: (error) => {
            this._alert.showAlert('No hay datos para imprimir');
            console.error(error);
          }
      }

    );

  }

  cashClosingReport(event: any) {
    event.preventDefault();
    if (confirm("Va a cerra la caja ")) {
      this._ticket.cashClosing();
    }
  }

}
