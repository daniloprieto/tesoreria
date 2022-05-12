import { TicketService } from './../../../core/services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { TicketBase } from '../../../core/models/ticket.model';
import { AlertService } from '../../../core/services/alert.service';
import { PrintService } from '../../../core/services/print.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelpersService } from '../../../core/services/helpers.service';


@Component({
  selector: 'app-ingress-tithes-and-offers',
  templateUrl: './ingress-tithes-and-offers.component.html',
  styleUrls: ['./ingress-tithes-and-offers.component.scss']
})
export class IngressTithesAndOffersComponent implements OnInit {

  public user!: User;
  public todayEn!: string;
  public todayEs!: string;
  public financialForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    amount: new FormControl(0,[Validators.required]),
  });

  public selectedDate = new FormControl();
  public isDigital = new FormControl(false);

  constructor(
    private _auth: AuthService,
    private _ticket: TicketService,
    private _alert: AlertService,
    private _print: PrintService,
    private _helpers: HelpersService
  ) { }

  ngOnInit(): void {
    this._auth.user.subscribe((user: User) => this.user = user);
    this.todayEs = this._helpers.todayEsStr();
    this.todayEn = this._helpers.todayEnStr();
    this.selectedDate.setValue(this.todayEn);

  }

  setTicket(event: any) {
    event.preventDefault();

    let n = (document.getElementById('name') as HTMLInputElement).value;
    let l = (document.getElementById('lastname') as HTMLInputElement).value;
    let name = n.charAt(0).toUpperCase() + (n.slice(1)).toLowerCase();
    let lastName = l.charAt(0).toUpperCase() + (l.slice(1)).toLowerCase();

    let tickets: TicketBase[] = [];

    if (Number((document.getElementById('diezmo') as HTMLInputElement).value) > 0) {
      let ticket: TicketBase = {
        name,
        lastName,
        amount: Number((document.getElementById('diezmo') as HTMLInputElement).value),
        type: 'tithe',
        digital: this.isDigital.value ? 1 : 0,
        treasurer: this.user.id
      };

      if (ticket.name.length > 0 && ticket.lastName.length > 0) {
        if (ticket.amount > 0) {
          tickets.push(ticket);
          } else {
            this._alert.showAlert('Debe ingresar al menos un valor');
          }
      } else {
        this._alert.showAlert('Debe ingresar nombre y apellido');
      }
    }

    if (Number((document.getElementById('ofrenda') as HTMLInputElement).value) > 0) {
      let ticket: TicketBase = {
        name: (document.getElementById('name') as HTMLInputElement).value,
        lastName: (document.getElementById('lastname') as HTMLInputElement).value,
        amount: Number((document.getElementById('ofrenda') as HTMLInputElement).value),
        type: 'offering',
        digital: this.isDigital.value ? 1 : 0,
        treasurer: this.user.id
      };

      if (ticket.name.length > 0 && ticket.lastName.length > 0) {
        if (ticket.amount > 0) {
          tickets.push(ticket);
          } else {
            this._alert.showAlert('Debe ingresar al menos un valor');
          }
      } else {
        this._alert.showAlert('Debe ingresar nombre y apellido');
      }
    }

    if(tickets.length > 0) this.saveTicket(tickets);

  }

  saveTicket(tickets: TicketBase[]) {

    let savedTickets: TicketBase[] = [];

    tickets.map((ticket, index) => {
      this._ticket.generateTicket(ticket)
        .subscribe({
          next: (res) => {
            console.log('new id', res)
            ticket.id = res.id;
            savedTickets.push(ticket);
            if ((index + 1) === tickets.length) {
              if (this._print.printTicket(savedTickets)) this.reset();
            }
          },
          error: (error) => {
            this._alert.showAlert('Error al guardar el Ticket');
            console.error(error);
          }
        })
    })

  }

  retrieveOrders(event: any, date: any = this.todayEn) {
    event.preventDefault();

    let utc = new Date(date).toJSON().slice(0, 10);

    this._ticket.getTicketsForDate(utc)
      .subscribe(
        {
          next: (tickets) => {

            if (tickets.length > 0) {

              if (this._print.printReport(tickets, date)) this.reset();

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

  reset() {
      (document.getElementById('name') as HTMLInputElement).value = '';
      (document.getElementById('lastname') as HTMLInputElement).value = '';
      (document.getElementById('diezmo') as HTMLInputElement).value = '';
      (document.getElementById('ofrenda') as HTMLInputElement).value = '';
  }
}
