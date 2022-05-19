import { Component, OnInit } from '@angular/core';
import { Report } from '../../../core/models/ticket.model';
import { TicketService } from '../../../core/services/ticket.service';
import { HelpersService } from '../../../core/services/helpers.service';

@Component({
  selector: 'app-balanz',
  templateUrl: './balanz.component.html',
  styleUrls: ['./balanz.component.scss']
})
export class BalanzComponent implements OnInit {

  public reports!: Report[];

  constructor(
    private _tickets: TicketService,
    private _helpers: HelpersService
  ) { }

  ngOnInit(): void {
    this._tickets.getCashClosingReports().subscribe(
      (reports) => {
        this.reports = reports;
        console.log(this.reports);
      }
    )
  }

  getDate(d:any): string {
    const date = new Date(d);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

}
