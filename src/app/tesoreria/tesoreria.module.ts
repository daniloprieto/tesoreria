import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TesoreriaRoutingModule } from './tesoreria-routing.module';
import { DashboardLiveComponent } from './components/dashboard-live/dashboard-live.component';
import { CoreModule } from '../core/core.module';
import { IngressTithesAndOffersComponent } from './components/ingress-tithes-and-offers/ingress-tithes-and-offers.component';
import { TicketsListComponent } from './components/tickets-list/tickets-list.component';
import { ModalDeleteTicketDialog } from './components/modal-delete-ticket/modal-delete-ticket.dialog';
import { ReportsComponent } from './components/reports/reports.component';
import { IngressComponent } from './components/ingress/ingress.component';
import { EgressComponent } from './components/egress/egress.component';
import { BalanzComponent } from './components/balanz/balanz.component';
import { ModalBalanzDetailsDialog } from './components/modal-balanz-details/modal-balanz-details.dialog';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardLiveComponent,
    IngressTithesAndOffersComponent,
    TicketsListComponent,
    ModalDeleteTicketDialog,
    ModalBalanzDetailsDialog,
    ReportsComponent,
    IngressComponent,
    EgressComponent,
    BalanzComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    TesoreriaRoutingModule
  ]
})
export class TesoreriaModule { }
