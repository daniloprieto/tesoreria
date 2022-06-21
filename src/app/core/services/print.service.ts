import { Injectable } from '@angular/core';
import { Ticket, TicketBase, CashClosingAmounts } from '../models/ticket.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { HelpersService, TYPE, STATUS } from './helpers.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  public versicle = $localize `<p>
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

  public disclaimer = $localize `<hr>
    Este comprobante es solamente
    para control interno de tesorería
    y no corresponde a pago, cuota
    social o similar.
    <hr>`;

  public disclaimerSign = $localize `
    Quien firma como dador reconoce <br>
    que da voluntariamente y por fé <br>
    <br><br><br>
    <hr><br>
    <span style="width:100%;text-align:center">Firma dador</span>
    `;

  user!: User;

  constructor(
    private _auth: AuthService,
    private _helpers: HelpersService
  ) {
    this._auth.user.subscribe((user: User) => this.user = user);
  }

  designTicket(tickets: TicketBase[]):any {

    let ids: number[] = [];
    let info = {
      name: '',
      lastName: '',
      titheAmount: 0,
      offeringAmount: 0,
      digital: 0
    };

    tickets.map((ticket) => {
      if (ticket.type === TYPE.TITHE) info.titheAmount = ticket.amount;
      if (ticket.type === TYPE.OFFERING) info.offeringAmount = ticket.amount;
      ids.push(ticket.id!);
      info.name = ticket.name;
      info.lastName = ticket.lastName;
      if (ticket.digital > 0) info.digital = ticket.digital;
    })

    let diezmoMessage = info.titheAmount > 0 ? $localize `$ ${info.titheAmount} (pesos) <br> en caracter de diezmo` : '';
    let ofrendaMessage = info.offeringAmount > 0 ? $localize `$ ${info.offeringAmount} (pesos) <br> en caracter de ofrenda` : '';

    let controlLine = '<span style="font-size:10px">Ticket Nº:' + ids + ' ';
    let controlData = info.digital > 0 ? controlLine + 'Digital' : controlLine + $localize `Efectivo`;

    let leafDesign = [
      '<html lang="es"><body style="font-family: monospace, monospace !important;font-size:14px !important">',
      controlData,
      '<div style="width:250px">',
      '<h5>'+ $localize `Iglesia Centro de Adoración Gilgal` + '</h5>',
      '<span>'+ $localize `Recibimos del sr/a: ` + '<br>' + info.name + ' ' + info.lastName + '</span><br>',
      '<span>' + $localize `la suma de: `+ '</span><br>',
      '<span>' + diezmoMessage + '</span><br>',
      '<span>' + ofrendaMessage + '</span><br>',
      '<br><span>' + $localize `Tesorero ${this.user.name} ${this.user.lastName}` + '</span><br><br>',
      '<div style="border:1px solid black; border-radius:15px;padding:5px">' + this.versicle + '</div><br>',
      '<div>'+ this.disclaimer +'</div><br>',
      '<span>'+ this.disclaimerSign +'</span>',
      '</div>',
      '</body></html>'
    ];

    let view = window.open('', 'PRINT', 'height=400,width=600')!;

    leafDesign.map((line) => view.document.write(line));

    return view;
  }
  designTicketIngress(ticket: TicketBase): any {

    const { id, digital, amount, description } = ticket;

    let controlLine = '<span style="font-size:10px">Ticket Nº:' + id + ' ';
    let controlData = digital > 0 ? controlLine + $localize `Ingreso Digital` : controlLine + $localize `Ingreso Efectivo`;

    let leafDesign = [
      '<html lang="es"><body style="font-family: monospace, monospace !important;font-size:14px !important">',
      controlData,
      '<div style="width:250px">',
      '<h5>'+$localize `Iglesia Centro de Adoración Gilgal`+'</h5>',
      '<span>'+$localize `Recibimos la suma de: `+'<br>$' + amount + '</span><br>',
      '<span>' + $localize `en concepto de: `+ '<br>' + description + '</span><br>',
      '<br><span>' + $localize `Tesorero ${this.user.name} ${this.user.lastName}` + '</span><br><br>',
      '<div>'+ this.disclaimer +'</div><br>',
      '</div>',
      '</body></html>'
    ];

    let view = window.open('', 'PRINT', 'height=400,width=600')!;

    leafDesign.map((line) => view.document.write(line));

    return view;
  }

  designTicketEgress(ticket: TicketBase): any {

    const { id, digital, amount, description } = ticket;

    let controlLine = '<span style="font-size:10px">Ticket Nº:' + id + ' ';
    let controlData = digital > 0 ? controlLine + 'Egreso Digital' : controlLine + 'Egreso Efectivo';

    let leafDesign = [
      '<html lang="es"><body style="font-family: monospace, monospace !important;font-size:14px !important">',
      controlData,
      '<div style="width:250px">',
      '<h5>' + $localize `Iglesia Centro de Adoración Gilgal`+ '</h5>',
      '<span>' + $localize `Se entrega la suma de: `+'<br>$' + amount + '</span><br>',
      '<span>' + $localize `en concepto de: `+'<br>' + description + '</span><br>',
      '<br><span>'+$localize `Tesorero ${this.user.name} ${this.user.lastName}` + '</span><br><br>',
      '<div>'+ this.disclaimer +'</div><br>',
      '</div>',
      '</body></html>'
    ];

    let view = window.open('', 'PRINT', 'height=400,width=600')!;

    leafDesign.map((line) => view.document.write(line));

    return view;
  }

  designReport(tickets: Ticket[], date: string):any {

    let totalTithesCash = 0;
    let totalOfferingsCash = 0;
    let totalIngressCash = 0;
    let totalEgressCash = 0;
    let totalCash = 0;

    let totalTithesDigital = 0;
    let totalOfferingsDigital = 0;
    let totalIngressDigital = 0;
    let totalEgressDigital = 0;
    let totalDigital = 0;

    let total = 0;

    return separateTicketsForType(tickets);

    function separateTicketsForType(tickets: Ticket[]){

      let tithes: Ticket[] = [];
      let offerings: Ticket[] = [];
      let ingress: Ticket[] = [];
      let egress: Ticket[] = [];

      tickets.map((ticket: Ticket) => {
        switch (ticket.type) {
          case TYPE.TITHE:
            tithes.push(ticket);
            break;
          case TYPE.OFFERING:
            offerings.push(ticket);
            break;
          case TYPE.INGRESS:
            ingress.push(ticket);
            break;
          case TYPE.EGRESS:
            egress.push(ticket);
            break;
        }
      });

      let tableTithes = tithes.length > 0 ? createTable(TYPE.TITHE, tithes) : [];
      let tableOfferings = offerings.length > 0 ? createTable(TYPE.OFFERING, offerings) : [];
      let tableIngress = ingress.length > 0 ? createTable(TYPE.INGRESS, ingress) : [];
      let tableEgress = egress.length > 0 ? createTable(TYPE.EGRESS, egress) : [];

      return showDesign(tableTithes, tableOfferings, tableIngress, tableEgress);

    }

    function createTable(type: string, tickets: Ticket[]) {

      let selected = '';

      switch (type) {
        case TYPE.TITHE:
          selected = $localize `Diezmos`;
          break;
        case TYPE.OFFERING:
          selected = $localize `Ofrendas`;
          break;
        case TYPE.INGRESS:
          selected = $localize `Otros Ingresos`;
          break;
        case TYPE.EGRESS:
          selected = $localize `Egresos`;
          break;
      };

      let table = [
        '<table><tr style="font-family: monospace, monospace !important;font-size:12px !important">',
        '<th style="border: 0.5px solid black">Nº</th>',
        '<th style="border: 0.5px solid black">T</th>',
        '<th style="border: 0.5px solid black">' + $localize `Nombre`+'</th>',
        '<th style="border: 0.5px solid black">' + selected + '</th>',
        '<th style="border: 0.5px solid black">' + $localize `Tesorero` + '</th></tr>'
      ];

      tickets.map((ticket) => {
        createRow(ticket).map((line) => table.push(line))
        calculateTotals(type, ticket.digital, ticket.amount);
      });

      table.push('</table><br>');

      return table;

    }

    function createRow(ticket: Ticket): string[]{

      const { id, name:nameSrc, lastName, digital:digitalSrc, amount, treasurer } = ticket;

      let digital = digitalSrc > 0 ? 'D' : 'E';


      let text = ticket.type === TYPE.OFFERING || ticket.type === TYPE.OFFERING
        ? nameSrc.slice(0, 1) + '. ' + (lastName.length > 6 ? (lastName.slice(0, 5) + '.') : lastName)
        : ticket.description?.slice(0, 5);

      let rowDesign = [
        '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
        '<td>' + id + '</td>',
        '<td>' + digital + '</td>',
        '<td>' + text + '</td>',
        '<td style="text-align:right">$' + amount + '</td>',
        '<td>' + treasurer + '</td>',
        '</tr>'
      ];

      return rowDesign;

    }

    function showDesign(tableTithes: string[], tableOfferings: string[], tableIngress: string[], tableEgress: string[]) {

      let dNow = new Date(date);
      let dateLocal = dNow.getDate()  + '/' + (dNow.getMonth() + 1) + '/' + dNow.getFullYear();


      let model = [
        '<html><body style="font-family: monospace, monospace !important;font-size:12px !important">',
        '<div style="width:250px">',
        '<h5>' + $localize `Iglesia Centro de Adoración Gilgal` + '</h5><br>',
        '<span>Reporte ' + dateLocal + '</span><br><br>',
      ];

      let view = window.open('', 'PRINT', 'height=400,width=600')!;

      model.map((line) => view.document.write(line));
      tableTithes.map((line) => view.document.write(line));
      tableOfferings.map((line) => view.document.write(line));
      tableIngress.map((line) => view.document.write(line));
      tableEgress.map((line) => view.document.write(line));


      let tableTotals = [
        '<table style="max-width:280px">',
        '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
        '<th style="border: 0.5px solid black">' + $localize `(Totales)` + '</th>',
        '<th style="border: 0.5px solid black">' + $localize `Efectivo` + '</th>',
        '<th style="border: 0.5px solid black">' + $localize `Digital` + '</th>',
        '<th style="border: 0.5px solid black">' + $localize `Total` + '</th>',
        '</tr>',
        '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
        '<td style="font-weigth:700;border: 0.5px solid black;font-family: monospace, monospace !important;font-size:12px !important">' + $localize `Diezmos` + '</td>',
        '<td style="text-align:right">$' + totalTithesCash + '</td>',
        '<td style="text-align:right">$' + totalTithesDigital + '</td>',
        '<td style="text-align:right"><strong>$' + (totalTithesCash + totalTithesDigital) + '</strong></td>',
        '</tr>',
        '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
        '<td style="font-weigth:700;border: 0.5px solid black;font-family: monospace, monospace !important;font-size:12px !important">' + $localize `Ofrendas` + '</td>',
        '<td style="text-align:right">$' + totalOfferingsCash + '</td>',
        '<td style="text-align:right">$' + totalOfferingsDigital + '</td>',
        '<td style="text-align:right"><strong>$' + (totalOfferingsCash + totalOfferingsDigital) + '</strong></td>',
        '</tr>',
        '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
        '<td style="font-weigth:700;border: 0.5px solid black;font-family: monospace, monospace !important;font-size:12px !important">' + $localize `Otros ingresos` + '</td>',
        '<td style="text-align:right">$' + totalIngressCash + '</td>',
        '<td style="text-align:right">$' + totalIngressDigital + '</td>',
        '<td style="text-align:right"><strong>$' + (totalIngressCash + totalIngressDigital) + '</strong></td>',
        '</tr>',
        '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
        '<td style="font-weigth:700;border: 0.5px solid black;font-family: monospace, monospace !important;font-size:12px !important">' + $localize `Egresos` + '</td>',
        '<td style="text-align:right">$' + totalEgressCash + '</td>',
        '<td style="text-align:right">$' + totalEgressDigital + '</td>',
        '<td style="text-align:right"><strong>$' + (totalEgressCash + totalEgressDigital) + '</strong></td>',
        '</tr>',
        '</table>',
        '<br><br><br>',
        '</div>',
        '</body></html>'
      ];

      tableTotals.map((line) => view.document.write(line));

      return view;

    }

    function calculateTotals(type: string, digital: number, amount: number) {

      switch (type) {
        case TYPE.TITHE:
          digital > 0
            ? totalTithesDigital += +amount
            : totalTithesCash += +amount;
          break;
        case TYPE.OFFERING:
          digital > 0
          ? totalOfferingsDigital += +amount
          : totalOfferingsCash += +amount;
          break;
        case TYPE.INGRESS:
          digital > 0
            ? totalIngressDigital += +amount
            : totalIngressCash += +amount;
          break;
        case TYPE.EGRESS:
          digital > 0
          ? totalEgressDigital += +amount
          : totalEgressCash += +amount;
          break;
      }

      totalCash = ( totalTithesCash + totalOfferingsCash + totalIngressCash ) - totalEgressCash;
      totalDigital = ( totalTithesDigital + totalOfferingsDigital + totalIngressDigital ) - totalEgressDigital;
      total = totalCash + totalDigital;

    }

  }

  printCashClosing(tickets: Ticket[], cashClosingAmounts: CashClosingAmounts, date: string) {

    const { totalIngress, headquarterGain, headquarterTithe, pastorGain } = cashClosingAmounts;

    let view = this.designReport(tickets.filter(t => Number(t.status) === STATUS.CLOSED), date);

    let cashClosingTable = [
      '<br><br><br>',
      '<table style="max-width:280px">',
      '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
      '<th style="border: 0.5px solid black">' + $localize `Cierre de Caja` + '</th>',
      '<th style="border: 0.5px solid black">' + $localize `TOTAL` + '</th>',
      '</tr>',
      '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
      '<td style="font-weigth:700;border: 0.5px solid black;font-family: monospace, monospace !important;font-size:12px !important">' + $localize `Total Ingresos` + '</td>',
      '<td style="text-align:right">$' + totalIngress + '</td>',
      '</tr>',
      '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
      '<td style="font-weigth:700;border: 0.5px solid black;font-family: monospace, monospace !important;font-size:12px !important">' + $localize `Caja Iglesia` + '</td>',
      '<td style="text-align:right">$' + headquarterGain + '</td>',
      '</tr>',
      '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
      '<td style="font-weigth:700;border: 0.5px solid black;font-family: monospace, monospace !important;font-size:12px !important">' + $localize `Relatorio` + '</td>',
      '<td style="text-align:right">$' + headquarterTithe + '</td>',
      '</tr>',
      '<tr style="font-family: monospace, monospace !important;font-size:12px !important">',
      '<td style="font-weigth:700;border: 0.5px solid black;font-family: monospace, monospace !important;font-size:12px !important">' + $localize `Oficio Pastor` + '</td>',
      '<td style="text-align:right">$' + pastorGain + '</td>',
      '</tr>',
      '</table>'];

    cashClosingTable.map(line => view.document.write(line));

    view.focus();
    view.print();
    view.close();
  }

  print(type: string, data: Ticket[] | any , date?: string) {
    let view;


    switch (type) {
      case 'designTicket':
        view = this.designTicket(data);
        break;
      case 'designReport':
        view = this.designReport(this._helpers.getActiveTickets(data), date!);
        break;
      case 'designTicketIngress':
        view = this.designTicketIngress(data);
        break;
      case 'designTicketEgress':
        view = this.designTicketEgress(data);
        break;
    }

    view.focus();
    view.print();
    view.close();

    return true;
  }
}
