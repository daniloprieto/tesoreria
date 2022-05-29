import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TicketBase } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { TYPE } from 'src/app/core/services/helpers.service';
import { PrintService } from 'src/app/core/services/print.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-ingress',
  templateUrl: './ingress.component.html',
  styleUrls: ['./ingress.component.scss']
})
export class IngressComponent implements OnInit {

  public user!: User;
  public financialForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    amount: new FormControl(0,[Validators.required]),
  });

  public isDigital = new FormControl(false);

  constructor(
    private _auth: AuthService,
    private _ticket: TicketService,
    private _alert: AlertService,
    private _print: PrintService,) { }

  ngOnInit(): void {
    this._auth.user.subscribe((user: User) => this.user = user);
  }

  setTicket(event: any) {
    event.preventDefault();

    if (Number((document.getElementById('amount') as HTMLInputElement).value) > 0) {
      let ticket: TicketBase = {
        amount: Number((document.getElementById('amount') as HTMLInputElement).value),
        type: TYPE.INGRESS,
        description: (document.getElementById('description') as HTMLInputElement).value,
        digital: this.isDigital.value ? 1 : 0,
        treasurer: this.user.id,
        name: '',
        lastName:'',
      };

      if (ticket.description!.length > 0 ) {
        if (ticket.amount > 0) {
          this.saveTicket(ticket);
          } else {
            this._alert.showAlert('Debe ingresar al menos un valor');
          }
      } else {
        this._alert.showAlert('Debe ingresar una descripción');
      }
    }

  }

  saveTicket(ticket: TicketBase) {

      this._ticket.generateTicket(ticket)
        .subscribe({
          next: (res) => {
            console.log('new id', res)
            ticket.id = res.id;
            if (this._print.print('designTicketIngress',ticket)) this.reset();
          },
          error: (error) => {
            this._alert.showAlert('Error al guardar el Ticket');
            console.error(error);
          }
        })

  }

  reset() {
      (document.getElementById('name') as HTMLInputElement).value = '';
      (document.getElementById('lastname') as HTMLInputElement).value = '';
      (document.getElementById('diezmo') as HTMLInputElement).value = '';
      (document.getElementById('ofrenda') as HTMLInputElement).value = '';
  }

}
