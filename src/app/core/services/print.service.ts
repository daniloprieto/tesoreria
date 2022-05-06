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
      '<html><body>',
      '<div style="width:250px">',
      '<h5>Iglesia Centro de Adoración Gilgal</h5><br>',
      '<span>Reporte ' + date + '</span><br><br>',
      '<table><tr><th>Nombre</th><th>Diezmo</th><th>Ofrenda</th><th>Tesorero</th></tr>'
    ];

    let view = window.open('', 'PRINT', 'height=400,width=600')!;

    model.map((line) => view.document.write(line));

    tickets.map((ticket:Ticket) => {
      view.document.write('<tr>')
      view.document.write('<td>' + ticket.name + ' ' + ticket.lastName + '</td>');
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
      '<table><tr><th>Diezmos</th><th>Ofrendas</th><th>Total</th></tr>',
      '<td>' + totalDiezmos + '</td>',
      '<td>' + totalOfrendas + '</td>',
      '<td>$' + total + '</td>',
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
