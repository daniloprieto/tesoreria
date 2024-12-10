import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Ticket, TicketBase, CashClosingAmounts, CashClosingInfo, Report } from '../models/ticket.model';
import { HttpCustomService } from './http-custom.service';
import { Observable, BehaviorSubject, Subject, from } from 'rxjs';
import { tap, first, take, concatMap, mergeMap, switchMap, filter, distinct, debounceTime } from 'rxjs/operators';
import { HelpersService, STATUS, TYPE } from './helpers.service';
import { PrintService } from './print.service';

export interface Headquarter {
  id: number;
  name: string;
  country: string;
  status: number;
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
    this._auth.user.subscribe((user: User) => {
      this.user = user;
    });
  }

  generateTicket(ticket: TicketBase): Observable<any> {
    const path = 'saveTicket.php';
    return this._http.post(path, ticket).pipe(
      tap(() => this.getTicketsForDate(this._helpers.utcSlice()))
    );
  }

  cancelTicket(ticket: Ticket): Observable<any> {
    ticket.status = STATUS.CANCEL;
    ticket.treasurer = this.user.id;

    const path = 'cancelTicket.php';
    return this._http.post(path, ticket).pipe(
      tap(() => this.getTicketsForDate(this._helpers.utcSlice()))
    );
  }

  closeTicket(ticket: Ticket): Observable<any> {
    ticket.status = STATUS.CLOSED;
    ticket.treasurer = this.user.id;

    const path = 'closeTicket.php';
    return this._http.post(path, ticket);
  }

  getHeadquarter(headquarter: string): Observable<Headquarter> {
    const path = 'getHeadquarter.php';
    const body = { headquarter };

    this._http.post(path, body).subscribe({
      next: (hq: Headquarter[]) => this.hq$.next(hq[0]),
      error: (error) => this.hq$.error(error)
    });

    return this.hq$;
  }

  getTicketsForDate(date: any): Observable<Ticket[]> {
    const path = 'getTickets.php';
    let body = { date, headquarter: 0 };

    if (date === this._helpers.utcSlice()) {
      this.getHeadquarter(this.user.headquarter)
        .pipe(
          tap((hq: Headquarter) => body.headquarter = hq.id),
          switchMap(() => this._http.post(path, body)),
          tap((tickets: Ticket[]) => this.allTicketsToday$.next(tickets)),
          tap((tickets: Ticket[]) => {
            const activeTickets = tickets.filter(t => +t.status! === STATUS.ACTIVED);
            this.activeTicketsToday$.next(activeTickets);
          })
        )
        .subscribe();

      return this.activeTicketsToday$;
    } else {
      return this._http.post(path, body);
    }
  }

  cashClosing(): BehaviorSubject<boolean> {
    let date = this._helpers.utcSlice();
    let cashClosingAmounts: CashClosingAmounts = this.initializeCashClosingAmounts();
    let allTickets: Ticket[] = [];
    let closedIds: number[] = [];

    this.loading.next(true);

    this.allTicketsToday$.pipe(
      first(),
      tap(tickets => {
        closedIds = tickets.filter(t => +t.status! !== STATUS.ACTIVED).map(t => +t.id!);
        console.log('Closed tickets:', closedIds);
      })
    ).subscribe();

    this.getTicketsForDate(date)
      .pipe(
        tap(t => console.log('entro aca', t)),
        concatMap((tickets) => this.getCashClosingInfo(this._helpers.getTotalActives(tickets))),
        tap((res) => {
          if (res.cashClosingAmounts?.totalIngress > 0) {
            cashClosingAmounts = res.cashClosingAmounts;
          } else {
            //console.error('Invalid cashClosingAmounts received:', res.cashClosingAmounts);
          }
        }),
        switchMap(res => from(res.cashClosingTickets)),
        mergeMap(ticket => this.generateTicket(ticket)),
        switchMap(() => this.allTicketsToday$),
        debounceTime(1000),
        take(1),
        tap(tickets => allTickets = this.nonClosed(tickets, closedIds)),
        switchMap(tickets => from(this.nonClosed(tickets, closedIds))),
        filter(t => +t.status! === STATUS.ACTIVED),
        distinct(),
        mergeMap(ticket => this.closeTicket(ticket)),
        debounceTime(1000),
        take(1),
        switchMap(() => this.getTicketsForDate(date)),
        switchMap(() => this.allTicketsToday$),
        tap((tickets) => {
          if (cashClosingAmounts) {
            this._print.printCashClosing(this.nonClosed(tickets, closedIds), cashClosingAmounts, date);
          } else {
            console.error('cashClosingAmounts is undefined');
          }
        }),
        distinct(),
        switchMap((tickets) => this.saveCashClosingReport(tickets, cashClosingAmounts)),
        tap(() => this.loading.next(false))
      )
      .subscribe();

    return this.loading;
  }

  getCashClosingInfo(amount: number): Observable<CashClosingInfo> {
    const cashClosingAmounts: CashClosingAmounts = {
      totalIngress: amount,
      headquarterTreasure: amount / 2,
      headquarterTithe: (amount / 2) * (10 / 100),
      headquarterGain: (amount / 2) - ((amount / 2) * (10 / 100)),
      pastorService: amount / 2,
      pastorTithe: (amount / 2) * (10 / 100),
      pastorGain: (amount / 2) - ((amount / 2) * (10 / 100)),
    };

    const cashClosingTickets: TicketBase[] = [
      {
        description: `Diezmo Iglesia ${this.user.headquarter} ${this._helpers.dateEsStr()}`,
        amount: cashClosingAmounts.headquarterTithe,
        treasurer: this.user.id,
        digital: 0,
        status: STATUS.REPORTED,
        type: TYPE.EGRESS,
      },
      {
        description: `Oficio del pastor ${this.user.headquarter} ${this._helpers.dateEsStr()}`,
        amount: cashClosingAmounts.pastorService,
        treasurer: this.user.id,
        digital: 0,
        status: STATUS.REPORTED,
        type: TYPE.EGRESS,
      },
      {
        description: `Diezmo del pastor ${this.user.headquarter} ${this._helpers.dateEsStr()}`,
        amount: cashClosingAmounts.pastorTithe,
        treasurer: this.user.id,
        digital: 0,
        status: STATUS.CLOSED,
        type: TYPE.INGRESS,
      },
    ];

    return new BehaviorSubject<CashClosingInfo>({ cashClosingAmounts, cashClosingTickets });
  }

  saveCashClosingReport(tickets: Ticket[], cashClosingAmounts: CashClosingAmounts): Observable<Report> {
    const ticketsFiltered = tickets
      .filter(t => +t.status! === STATUS.CLOSED || +t.status! === STATUS.CANCEL)
      .map(t => Number(t.id));

    const report: Report = {
      ...cashClosingAmounts,
      tickets: ticketsFiltered,
      treasurer: this.user.id,
      headquarter: this.user.headquarter,
    };

    const path = 'saveCashClosingReport.php';
    return this._http.post(path, report);
  }

  getCashClosingReports(): Observable<Report[]> {
    const path = 'getCashClosingReport.php';
    return this._http.post(path, '');
  }

  private initializeCashClosingAmounts(): CashClosingAmounts {
    return {
      totalIngress: 0,
      headquarterTreasure: 0,
      headquarterTithe: 0,
      headquarterGain: 0,
      pastorService: 0,
      pastorTithe: 0,
      pastorGain: 0,
    };
  }

  private nonClosed(tickets: Ticket[], closedIds: number[]): Ticket[] {
    return tickets.filter(t => !closedIds.includes(+t.id!));
  }
}
