import { TicketService } from './../../../core/services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { TicketBase } from '../../../core/models/ticket.model';
import { AlertService } from '../../../core/services/alert.service';
import { environment } from 'src/environments/environment';
import { PrintService } from '../../../core/services/print.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-live',
  templateUrl: './dashboard-live.component.html',
  styleUrls: ['./dashboard-live.component.scss']
})
export class DashboardLiveComponent implements OnInit {

  public user!: User;
  public date = new Date().toLocaleDateString();
  public financialForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    tithe: new FormControl(0),
    offering: new FormControl(0)
  });

  constructor(
    private _auth: AuthService,
    private _ticket: TicketService,
    private _alert: AlertService,
    private _print: PrintService
  ) { }

  ngOnInit(): void {
    this._auth.user.subscribe((user:User) => this.user = user)
  }

  setMessage(event:any) {
    event.preventDefault();

    let ticket: TicketBase = {
      name: (document.getElementById('name') as HTMLInputElement).value,
      lastName: (document.getElementById('lastname') as HTMLInputElement).value,
      tithe: Number((document.getElementById('diezmo') as HTMLInputElement).value),
      offering: Number((document.getElementById('ofrenda') as HTMLInputElement).value),
      treasurer: this.user.id
    };

    ticket.name = ticket.name.charAt(0).toUpperCase() + (ticket.name.slice(1)).toLowerCase();
    ticket.lastName = ticket.lastName.charAt(0).toUpperCase() + (ticket.lastName.slice(1)).toLowerCase();


    if (ticket.name.length > 0 && ticket.lastName.length > 0) {
      if (ticket.tithe > 0 || ticket.offering > 0) {
        this.saveTicket(ticket);
        } else {
          this._alert.showAlert('Debe ingresar al menos un valor');
        }
    } else {
      this._alert.showAlert('Debe ingresar nombre y apellido');
    }

  }

  saveTicket(ticket:TicketBase) {

    this._ticket.generateTicket(ticket)
      .then(res=>res.json())
      .then((res: any) => {
        console.log('new id',res)
        if (this._print.printTicket(ticket, res.id)) this.reset()
      })
      .catch((error) => {
        this._alert.showAlert('Error al guardar el Ticket');
        console.error(error);
      });
  }


  retrieveOrders(event: any, date: any = this.date) {
    event.preventDefault();

    let utc = new Date(date).toJSON().slice(0, 10);

    let data = { date: utc };

    const dataClear = JSON.stringify(data);

    fetch(environment.api + "getTickets.php", {
      method: "POST",
      body: dataClear,
    })
      .then(response => response.json())
      .then(tickets => {

        console.log(tickets)

        if (tickets.length > 0) {

          if (this._print.printReport(tickets, date)) this.reset();

        } else {

          this._alert.showAlert('No hay datos para imprimir')

        }
      })
      .catch((error) => {
        this._alert.showAlert('No hay datos para imprimir');
        console.error(error);
      });

  }

  reset() {
      (document.getElementById('name') as HTMLInputElement).value = '';
      (document.getElementById('lastname') as HTMLInputElement).value = '';
      (document.getElementById('diezmo') as HTMLInputElement).value = '';
      (document.getElementById('ofrenda') as HTMLInputElement).value = '';
  }

}
