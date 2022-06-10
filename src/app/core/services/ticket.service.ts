import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Ticket, TicketBase, CashClosingAmounts, CashClosingInfo, Report } from '../models/ticket.model';
import { HttpCustomService } from './http-custom.service';
import { Observable, tap, Subject, concatMap, BehaviorSubject, map, from, mergeMap, switchMap, filter } from 'rxjs';
import { HelpersService, STATUS, TYPE } from './helpers.service';
import { PrintService } from './print.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  public user!: User;
  public ticketsToday$ = new Subject<Ticket[]>();

  constructor(
    private _auth: AuthService,
    private _http: HttpCustomService,
    private _helpers: HelpersService,
    private _print: PrintService
  ) {
    this._auth.user.subscribe(
      (user: User) => {
        this.user = user;
      })
  }


  generateTicket(ticket: TicketBase):Observable<any>{

    const path = 'saveTicket.php';
    const body = ticket;

    return this._http.post(path, body)
      .pipe(
        tap( res => this.getTicketsForDate(this._helpers.utcSlice()))
      );

  }

  cancelTicket(ticket: Ticket):Observable<any> {
    ticket.status = STATUS.CANCEL;
    ticket.treasurer = this.user.id;

    const path = 'cancelTicket.php';
    const body = ticket;

    return this._http.post(path, body).pipe(
      tap( () => this.getTicketsForDate(this._helpers.utcSlice()))
    );;
  }

  closeTicket(ticket: Ticket): Observable<any> {
    ticket.status = STATUS.CLOSED;
    ticket.treasurer = this.user.id;

    const path = 'closeTicket.php';
    const body = ticket;

    return this._http.post(path, body);
  }

  getTicketsForDate(date: any):Observable<Ticket[]> {
    const path = 'getTickets.php';
    const body = { date };

    if (date === this._helpers.utcSlice()) {

      this._http.post(path, body)
      .subscribe({
        next: (tickets:Ticket[]) => {

          let t = tickets.filter(t => (t.headquarter === this.user.headquarter));
          this.ticketsToday$.next(t);

        },
        error: (error) => {
          this.ticketsToday$.error(error);
        }
      });

      return this.ticketsToday$;

    } else {

      return this._http.post(path, body);

    }

  }

  cashClosing() {
    let date = this._helpers.utcSlice();
    let cashClosingAmounts: CashClosingAmounts;
    let allTickets: Ticket[];

    this.getTicketsForDate(date)
      .pipe(
        concatMap((tickets) => this.getCashClosingInfo(this._helpers.getTotalActives(tickets.filter(t => t.status === STATUS.ACTIVED)))),
        tap((res) => cashClosingAmounts = res.cashClosingAmounts),
        switchMap(res => from(res.cashClosingTickets)),
        switchMap(ticket => this.generateTicket(ticket)),
        concatMap(() => this.getTicketsForDate(date)),
        tap((tickets) => allTickets = tickets),
        switchMap(tickets => from(tickets.filter(t => +t.status! === 1))),
        switchMap(ticket => this.closeTicket(ticket)),
        tap(res => this._print.printCashClosing(allTickets, cashClosingAmounts, date)),
        concatMap(() => this.getTicketsForDate(date)),
        switchMap((tickets) => this.saveCashClosingReport(tickets, cashClosingAmounts)),
      )
      .subscribe();
  }

  getCashClosingInfo(amount: number):Observable<CashClosingInfo> {

    let pastorService = amount / 2;
    let pastorTithe = pastorService * (10 / 100); //Diezmo del pastor
    let pastorGain = pastorService - pastorTithe; //Ganancia del Pastor
    let headquarterTreasure = (amount / 2) + pastorTithe;
    let headquarterTithe = headquarterTreasure * (10 / 100); //Diezmo de la filial (Relatorio)
    let headquarterGain = headquarterTreasure - headquarterTithe; //caja de tesoreria de la filial


    let cashClosingAmounts: CashClosingAmounts = {
      headquarterTreasure,
      headquarterTithe,
      headquarterGain,
      pastorService,
      pastorTithe,
      pastorGain,
    }

    let data = {
      name: '',
      lastName: '',
      treasurer: this.user.id,
      digital: 0,
      status: STATUS.REPORTED,
      type: TYPE.EGRESS,
    }

    let cashClosingTickets: TicketBase[] = [
      {
        ...data,
        description: 'Diezmo Iglesia ' + this.user.headquarter + ' ' + this._helpers.dateEsStr(),
        amount: headquarterTithe,
      },
      {
        ...data,
        description: 'Oficio del pastor ' + this.user.headquarter + ' ' + this._helpers.dateEsStr(),
        amount: pastorService,
      },
      {
        ...data,
        status: STATUS.CLOSED,
        description: 'Diezmo del pastor ' + this.user.headquarter + ' ' + this._helpers.dateEsStr(),
        amount: pastorTithe,
        type: TYPE.INGRESS,
      }
    ];

    return new BehaviorSubject<CashClosingInfo>({ cashClosingAmounts, cashClosingTickets });

  }

  saveCashClosingReport(tickets: Ticket[], cashClosingAmounts: CashClosingAmounts):Observable<Report> {
    const ticketsFiltered = tickets.filter(t => +t.status! === STATUS.CLOSED || +t.status! === STATUS.CANCEL).map(t => Number(t.id));

    const report: Report = {
      ...cashClosingAmounts,
      tickets: ticketsFiltered,
      treasurer: this.user.id,
      headquarter: this.user.headquarter
    }

    const path = 'saveCashClosingReport.php';
    const body = report;

    return this._http.post(path, body);


  }

  getCashClosingReports():Observable<Report[]> {
    const path = 'getCashClosingReport.php';
    const body = '';

    return this._http.post(path, body);
  }

}
