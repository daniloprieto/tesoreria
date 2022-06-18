import { TicketService } from './../../../core/services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { TicketBase } from '../../../core/models/ticket.model';
import { AlertService } from '../../../core/services/alert.service';
import { PrintService as miprint } from '../../../core/services/print.service';
import { Validators, FormBuilder } from '@angular/forms';
import { TYPE } from '../../../core/services/helpers.service';
import { Subscription, distinct, tap } from 'rxjs';

//prueba
import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print';
import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';



@Component({
  selector: 'app-ingress-tithes-and-offers',
  templateUrl: './ingress-tithes-and-offers.component.html',
  styleUrls: ['./ingress-tithes-and-offers.component.scss']
})
export class IngressTithesAndOffersComponent implements OnInit {

  //prueba
  status: boolean = false;
  usbPrintDriver!: UsbDriver;
  webPrintDriver!: WebPrintDriver;
  ip: string = '';
  //prueba end

  public user!: User;

  private _sub$: Subscription[] = [];

  public ticketForm = this._fb.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    isDigital: [false],
    tithe: [''],
    offering:['']
  });

  constructor(
    private _auth: AuthService,
    // private _ticket: TicketService,
    // private _alert: AlertService,
    // private _print: miprint,
    private _fb: FormBuilder,
    //prueba
    private printService: PrintService
    //prueba end
  ) {
    // prueba
    this.usbPrintDriver = new UsbDriver();
    this.printService.isConnected.subscribe(result => {
        this.status = result;
        if (result) {
            console.log('Connected to printer!!!');
        } else {
        console.log('Not connected to printer.');
        }
    });
    //prueba end
  }

  ngOnInit(): void {
    this._sub$.push(
      this._auth.user.subscribe((user: User) => this.user = user)
    );
  }

  //prueba
  requestUsb() {
    this.usbPrintDriver.requestUsb().subscribe(result => {
        this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
    });
  }

  connectToWebPrint() {
      this.webPrintDriver = new WebPrintDriver(this.ip);
      this.printService.setDriver(this.webPrintDriver, 'WebPRNT');
  }

  print(driver?: PrintDriver) {
      this.printService.init()
          .setBold(true)
          .writeLine('Hello World!')
          .setBold(false)
          .feed(4)
          .cut('full')
          .flush();
  }
  //prueba end

  // formatterStrings(s: string): string{
  //   return s.charAt(0).toUpperCase() + (s.slice(1)).toLowerCase();
  // }

  // setTicket(event: any) {
  //   event.preventDefault();

  //   const form = this.ticketForm;

  //   let name = this.formatterStrings(form.get('name')?.value);
  //   let lastName = this.formatterStrings(form.get('lastName')?.value);
  //   let digital = form.get('isDigital')?.value ? 1 : 0;
  //   let treasurer = this.user.id;

  //   if (form.invalid) {

  //     this._alert.showAlert('Debe ingresar nombre y apellido');

  //   } else {

  //     let tickets: TicketBase[] = [];

  //     let ticket: TicketBase = {
  //       name, lastName, digital, treasurer,
  //       amount: 0,
  //       type: '',
  //     };

  //     if (form.get('tithe')?.value <= 0 && form.get('offering')?.value <= 0) {

  //       this._alert.showAlert('Debe ingresar al menos un valor');

  //     } else {

  //       if (form.get('tithe')?.value > 0) {
  //         tickets.push(
  //           {
  //             ...ticket,
  //             amount: form.get('tithe')?.value,
  //             type: TYPE.TITHE
  //           }
  //         )
  //       }

  //       if (form.get('offering')?.value > 0) {
  //         tickets.push(
  //           {
  //             ...ticket,
  //             amount: form.get('offering')?.value,
  //             type: TYPE.OFFERING
  //           }
  //         )
  //       };

  //       if(tickets.length > 0) this.saveTicket(tickets);
  //     }


  //   }

  // }

  // saveTicket(tickets: TicketBase[]) {

  //   let savedTickets: TicketBase[] = [];

  //   tickets.map((ticket, index) => {
  //     this._sub$.push(
  //       this._ticket.generateTicket(ticket)
  //         .pipe(
  //           distinct(),
  //           tap({
  //             next: ({ id }) => {
  //               ticket.id = id;
  //               savedTickets.push(ticket);
  //               if ((index + 1) === tickets.length) {
  //                 if (this._print.print('designTicket', savedTickets)) this.reset();
  //               }
  //             },
  //             error: (error) => {
  //               this._alert.showAlert('Error al guardar el Ticket');
  //               console.error(error);
  //             }
  //           })
  //         )
  //         .subscribe()
  //     );
  //   })

  // }

  // reset() {
  //   this.ticketForm.reset();
  // }

  // ngOnDestroy(): void {
  //   this.reset();
  //   this._sub$.map((sub) => sub.unsubscribe());
  // }
}
