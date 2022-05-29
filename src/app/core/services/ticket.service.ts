import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Ticket, TicketBase, CashClosingAmounts, CashClosingInfo, Report } from '../models/ticket.model';
import { HttpCustomService } from './http-custom.service';
import { Observable, tap, Subject, concatMap, BehaviorSubject, map, from, mergeMap, switchMap } from 'rxjs';
import { HelpersService } from './helpers.service';
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
    ticket.status = 0;
    ticket.treasurer = this.user.id;

    const path = 'cancelTicket.php';
    const body = ticket;

    return this._http.post(path, body).pipe(
      tap( res => this.getTicketsForDate(this._helpers.utcSlice()))
    );;
  }

  closeTicket(ticket: Ticket): Observable<any> {
    ticket.status = 3;
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
          let t = tickets.filter(t => t.headquarter === this.user.headquarter);
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
        concatMap((tickets) => this.getCashClosingInfo(this._helpers.getTotalActives(tickets))),
        tap((res) => cashClosingAmounts = res.cashClosingAmounts),
        switchMap(res => from(res.cashClosingTickets)),
        switchMap(ticket => this.generateTicket(ticket)),
        concatMap((lastId) => this.getTicketsForDate(date)),
        tap((tickets) => allTickets = tickets),
        switchMap(tickets => from(tickets.filter(t => Number(t.status) === 1))),
        switchMap(ticket => this.closeTicket(ticket)),
        tap(res => this._print.printCashClosing(allTickets, cashClosingAmounts, date)),
        concatMap((lastId) => this.getTicketsForDate(date)),
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


    let cashClosingTickets: TicketBase[] = [
      {
        status: 4,
        name: '',
        lastName: '',
        description: 'Diezmo Iglesia ' + this.user.headquarter + ' ' + this._helpers.todayEsStr(),
        amount: headquarterTithe,
        treasurer: this.user.id,
        type: 'Egress',
        digital: 0
      },
      {
        status: 4,
        name: '',
        lastName: '',
        description: 'Oficio del pastor ' + this.user.headquarter + ' ' + this._helpers.todayEsStr(),
        amount: pastorService,
        treasurer: this.user.id,
        type: 'Egress',
        digital: 0
      },
      {
        status: 3,
        name: '',
        lastName: '',
        description: 'Diezmo del pastor ' + this.user.headquarter + ' ' + this._helpers.todayEsStr(),
        amount: pastorTithe,
        treasurer: this.user.id,
        type: 'Ingress',
        digital: 0
      }
    ];

    return new BehaviorSubject<CashClosingInfo>({ cashClosingAmounts, cashClosingTickets });

  }

  saveCashClosingReport(tickets: Ticket[], cashClosingAmounts: CashClosingAmounts):Observable<Report> {
    const ticketsFiltered = tickets.filter(t => Number(t.status) === 3 || Number(t.status) === 0).map(t => Number(t.id));

    const report:Report = {
      headquarterTreasure: cashClosingAmounts.headquarterTreasure,
      headquarterTithe: cashClosingAmounts.headquarterTithe,
      headquarterGain: cashClosingAmounts.headquarterGain,
      pastorService: cashClosingAmounts.pastorService,
      pastorTithe: cashClosingAmounts.pastorTithe,
      pastorGain: cashClosingAmounts.pastorGain,
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
