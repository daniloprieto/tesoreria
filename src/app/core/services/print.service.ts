import { Injectable } from '@angular/core';
import { Ticket, TicketBase } from '../models/ticket.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  public versicle = `<p>
    Traed todos los diezmos
    y probadme ahora en esto,
    dice Johová...
    Si no abriré las ventanas
    de los cielos y derramaré
    bendición hasta que sobreabunde.
    <br>
    <span style="float:right">Malaquías 3:10<span>
    </p>
    `;

  public disclaimer = `<hr>
    Este comprobante es solamente
    para control interno de tesorería
    y no corresponde a pago, cuota
    social o similar.
    <hr>`;

  public disclaimerSign = `
    Quien firma como dador reconoce <br>
    que da voluntariamente y por fé <br>
    <br><br><br>
    <hr><br>
    <span style="width:100%;text-align:center">Firma dador</span>
    `;

  user!: User;

  constructor(private _auth: AuthService) {
    this._auth.user.subscribe((user: User) => this.user = user);
  }

  printTicket(ticket: TicketBase, id: number) {

    console.log(id,ticket);

    let diezmoMessage = ticket.tithe > 0 ? `$ ${ticket.tithe} (pesos) <br> en caracter de diezmo` : '';
    let ofrendaMessage = ticket.offering > 0 ? `$ ${ticket.offering} (pesos) <br> en caracter de ofrenda` : '';

    let leafDesign = [
      '<html lang="es"><body style="font-family: monospace, monospace !important;font-size:12px">',
      '<span style="font-size:10px">Ticket Nº:' + id + '</span><br>',
      '<div style="width:250px">',
      '<h5>Iglesia Centro de Adoración Gilgal</h5>',
      '<span>Recibimos del sr/a: <br>' + ticket.name + ' ' + ticket.lastName + '</span><br>',
      '<span>la suma de: </span><br>',
      '<span>' + diezmoMessage + '</span><br>',
      '<span>' + ofrendaMessage + '</span><br>',
      '<br><span> Tesorero ' + this.user.name + '</span><br><br>',
      '<div style="border:1px solid black; border-radius:15px;padding:5px">' + this.versicle + '</div><br>',
      '<div>'+ this.disclaimer +'</div><br>',
      '<span>'+ this.disclaimerSign +'</span>',
      '</div>',
      '</body></html>'
    ];

    let view = window.open('', 'PRINT', 'height=400,width=600')!;

    leafDesign.map((line) => view.document.write(line));

    //view.document.close();
    view.focus();
    view.print();
    view.close();
    return true;
  }

  printReport(tickets:Ticket[], date: string) {
    let totalDiezmos = 0;
    let totalOfrendas = 0;
    let total = 0;

    let model = [
      '<html><body style="font-family: monospace, monospace !important;font-size:12px !important">',
      '<div style="width:250px">',
      '<h5>Iglesia Centro de Adoración Gilgal</h5><br>',
      '<span>Reporte ' + date + '</span><br><br>',
      '<table><tr style="font-family: monospace, monospace !important;font-size:12px !important">',
      '<th style="border: 0.5px solid black">Ticket</th>',
      '<th style="border: 0.5px solid black">Nombre</th>',
      '<th style="border: 0.5px solid black">Diezmo</th>',
      '<th style="border: 0.5px solid black">Ofrenda</th>',
      '<th style="border: 0.5px solid black">Tesorero</th></tr>'
    ];

    let view = window.open('', 'PRINT', 'height=400,width=600')!;

    model.map((line) => view.document.write(line));

    tickets.map((ticket: Ticket) => {})

    tickets.map((ticket:Ticket) => {
      view.document.write('<tr style="font-family: monospace, monospace !important;font-size:12px !important">')
      view.document.write('<td>' + ticket.id + '</td>');
      view.document.write('<td>' + ticket.name.slice(0,1) + '. ' + ticket.lastName + '</td>');
      view.document.write('<td>' + Number(ticket.tithe) + '</td>');
      view.document.write('<td>' + Number(ticket.offering) + '</td>');
      view.document.write('<td>' + ticket.treasurer + '</td>');
      view.document.write('</tr>');

      totalDiezmos += Number(ticket.tithe);
      totalOfrendas += Number(ticket.offering);
    })

    view.document.write('</table><br>');

    total = totalDiezmos + totalOfrendas;

    let modelTwo = [
      '<table><tr style="font-family: monospace, monospace !important;font-size:12px !important">',
      '<th>Diezmos</th><th>Ofrendas</th><th>Total</th></tr>',
      '<td style="font-family: monospace, monospace !important;font-size:12px !important">' + totalDiezmos + '</td>',
      '<td style="font-family: monospace, monospace !important;font-size:12px !important">' + totalOfrendas + '</td>',
      '<td style="font-family: monospace, monospace !important;font-size:12px !important">$' + total + '</td>',
      '</table>',
      '<br><br><br>',
      '<span> Revisor de cuentas</span>',
      '</div>',
      '</body></html>'
    ];

    modelTwo.map((line) => view.document.write(line));

    view.focus();
    view.print();
    view.close();
    return true;

  }
}
