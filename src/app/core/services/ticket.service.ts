import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Ticket, TicketBase } from '../models/ticket.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private userAvailable = false;
  public user!: User;

  constructor(
    private _auth: AuthService
  ) {
    this._auth.user.subscribe(
      (user: User) => {
        this.user = user;
        this.userAvailable = user.role === 'treasurer' ? true : false;
      })
  }


  generateTicket(ticket: TicketBase): Promise<any>{

    // if (!this.userAvailable) {

    // };

    const dataClear = JSON.stringify(ticket);

    return fetch(environment.api + "saveTicket.php", {
      method: "POST",
      body: dataClear,
    });

  }
}
