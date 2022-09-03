import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Ticket, TicketBase, CashClosingAmounts, CashClosingInfo, Report } from '../models/ticket.model';
import { HttpCustomService } from './http-custom.service';
import { Observable, tap, first, take ,Subject, concatMap, BehaviorSubject, debounce, timer, from, mergeMap, switchMap, filter, distinct, last, map, debounceTime } from 'rxjs';
import { HelpersService, STATUS, TYPE } from './helpers.service';
import { PrintService } from './print.service';

export interface Headquarter{
  id: number,
  name: string,
  country: string,
  status: number
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  public user!: User;
  public activeTicketsToday$ = new Subject<Ticket[]>();
  public allTicketsToday$ = new Subject<Ticket[]>();
  public hq$ = new Subject<Headquarter>();
  public loading = new BehaviorSubject<boolean>(false);

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
    );
  }

  closeTicket(ticket: Ticket): Observable<any> {

    ticket.status = STATUS.CLOSED;
    ticket.treasurer = this.user.id;

    const path = 'closeTicket.php';
    const body = ticket;

    return this._http.post(path, body);
  }

  getHeadquarter(headquarter: string): Observable<Headquarter>{
    const path = 'getHeadquarter.php';
    const body = { headquarter };

    this._http.post(path, body)
      .subscribe({
        next: (h:Headquarter[]) => this.hq$.next(h[0]),
        error: (error) => this.hq$.error(error)
      })

    return this.hq$
      
  }

  getTicketsForDate(date: any):Observable<Ticket[]> {
    const path = 'getTickets.php';
    let body = { date, headquarter: 0 };

    if (date === this._helpers.utcSlice()) {

      this.getHeadquarter(this.user.headquarter)
        .pipe(
          tap((hq: Headquarter) => body.headquarter = hq.id),
          switchMap(() => this._http.post(path, body)),
          tap((t: Ticket[]) => this.allTicketsToday$.next(t)),
          tap({
            next: (tickets: Ticket[]) => {
              let t = tickets.filter(t => +t.status! === STATUS.ACTIVED);
              this.activeTicketsToday$.next(t)
            },
            error: (error) => this.activeTicketsToday$.error(error)
          })
        )
        .subscribe()
      
      return this.activeTicketsToday$;

    } else {

      return this._http.post(path, body);

    }
      

  }


  cashClosing(): BehaviorSubject<boolean> {
    let date = this._helpers.utcSlice();
    let cashClosingAmounts: CashClosingAmounts;
    let allTickets: Ticket[];
    let closedIds: number[] = [];

    this.loading.next(true);

    this.allTicketsToday$
      .pipe(
        first(),
        tap(tickets => {
          closedIds = tickets.filter(t => +t.status! !== STATUS.ACTIVED).map(t => +t.id!);
          console.log('los cerrados',closedIds)
        })
      )
      .subscribe()

    this.getTicketsForDate(date)
      .pipe(
        tap(t => console.log('entro aca', t)),
        concatMap((tickets) => this.getCashClosingInfo(this._helpers.getTotalActives(tickets))),
        tap(t => console.log('pasa aca', t)),
        tap((res) => { if (res.cashClosingAmounts.totalIngress > 0) cashClosingAmounts = res.cashClosingAmounts }),
        switchMap(res => from(res.cashClosingTickets)),
        mergeMap(ticket => this.generateTicket(ticket)),
        switchMap(() => this.allTicketsToday$),
        debounceTime(1000),
        take(1),
        tap(tickets => allTickets = nonClosed(tickets, closedIds)),//no se si se usa
        switchMap(tickets => from(nonClosed(tickets, closedIds))),
        filter(t => +t.status! === STATUS.ACTIVED),
        distinct(),
        mergeMap(ticket => this.closeTicket(ticket)),
        debounceTime(1000),
        take(1),
        switchMap(() => this.getTicketsForDate(date)),
        switchMap(() => this.allTicketsToday$),
        tap((tickets) => this._print.printCashClosing(nonClosed(tickets, closedIds), cashClosingAmounts, date)),
        distinct(),
        switchMap((tickets) => this.saveCashClosingReport(tickets, cashClosingAmounts)),
        tap(() => this.loading.next(false))
      )
      .subscribe();
    
    return this.loading

    function nonClosed(tickets: Ticket[], closedIds: number[]): Ticket[] {
      
      let nonClosedTickets: Ticket[] = [];

      tickets.forEach(t => {
        let closed = false;
        closedIds.forEach(c => +t.id! === c ? closed = true : false);
        if (!closed) nonClosedTickets.push(t);
      });

      return nonClosedTickets
      
    }
  }

  getCashClosingInfo(amount: number):Observable<CashClosingInfo> {

    let pastorService = amount / 2;
    let pastorTithe = pastorService * (10 / 100); //Diezmo del pastor
    let pastorGain = pastorService - pastorTithe; //Ganancia del Pastor
    let headquarterTreasure = (amount / 2) + pastorTithe;
    let headquarterTithe = headquarterTreasure * (10 / 100); //Diezmo de la filial (Relatorio)
    let headquarterGain = headquarterTreasure - headquarterTithe; //caja de tesoreria de la filial


    let cashClosingAmounts: CashClosingAmounts = {
      totalIngress: amount,
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
