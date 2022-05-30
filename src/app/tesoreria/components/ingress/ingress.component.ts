import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TicketBase } from 'src/app/core/models/ticket.model';
import { User } from 'src/app/core/models/user.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { TYPE } from 'src/app/core/services/helpers.service';
import { PrintService } from 'src/app/core/services/print.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingress',
  templateUrl: './ingress.component.html',
  styleUrls: ['./ingress.component.scss']
})
export class IngressComponent implements OnInit {

  private _sub$: Subscription[] = [];
  public user!: User;
  public financialForm = this._fb.group({
    description:['', [Validators.required, Validators.minLength(5)]],
    amount: ['', Validators.required],
    digital:[false]
  });

  constructor(
    private _auth: AuthService,
    private _ticket: TicketService,
    private _alert: AlertService,
    private _print: PrintService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this._sub$.push(
      this._auth.user.subscribe((user: User) => this.user = user)
    );
  }

  setTicket(event: any) {
    event.preventDefault();

    if (this.financialForm.valid) {

      if (this.financialForm.get('amount')?.value > 0) {

        let ticket: TicketBase = {
          amount: this.financialForm.get('amount')?.value,
          type: TYPE.INGRESS,
          description: this.financialForm.get('description')?.value,
          digital: this.financialForm.get('isDigital')?.value ? 1 : 0,
          treasurer: this.user.id,
          name: '',
          lastName: '',
        };

        this.saveTicket(ticket);

      } else {
          this._alert.showAlert('Debe ingresar al menos un valor');
      }
    } else {
      this._alert.showAlert('Debe ingresar una descripción');
    }

  }

  saveTicket(ticket: TicketBase) {
    this._sub$.push(
      this._ticket.generateTicket(ticket)
        .subscribe({
          next: (res) => {
            ticket.id = res.id;
            if (this._print.print('designTicketIngress', ticket)) this.reset();
          },
          error: (error) => {
            this._alert.showAlert('Error al guardar el Ticket');
            console.error(error);
          }
        })
    );

  }

  reset() {
    this.financialForm.reset();
  }

  ngOnDestroy(): void {
    this.reset();
    this._sub$.map((sub) => sub.unsubscribe());
  }

}
