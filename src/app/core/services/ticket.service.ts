import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Ticket, TicketBase } from '../models/ticket.model';
import { HttpCustomService } from './http-custom.service';
import { Observable, tap, Subject } from 'rxjs';
import { HelpersService } from './helpers.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private userAvailable = false;
  public user!: User;
  public ticketsToday$: Subject<Ticket[]> = new Subject<Ticket[]>();


  constructor(
    private _auth: AuthService,
    private _http: HttpCustomService,
    private _helpers: HelpersService
  ) {
    this._auth.user.subscribe(
      (user: User) => {
        this.user = user;
        this.userAvailable = user.role === 'treasurer' ? true : false;
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

  cancelTicket(ticket: Ticket) {
    ticket.status = 0;
    ticket.treasurer = this.user.id;

    const path = 'cancelTicket.php';
    const body = ticket;

    return this._http.post(path, body).pipe(
      tap( res => this.getTicketsForDate(this._helpers.utcSlice()))
    );;
  }

  getTicketsForDate(date: any):Observable<Ticket[]> {
    const path = 'getTickets.php';
    const body = { date };

    if (date === this._helpers.utcSlice()) {

      this._http.post(path, body).subscribe({
        next: (tickets) => {
          this.ticketsToday$.next(tickets)
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


}
