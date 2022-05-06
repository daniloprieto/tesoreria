import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TesoreriaRoutingModule } from './tesoreria-routing.module';
import { DashboardLiveComponent } from './components/dashboard-live/dashboard-live.component';


@NgModule({
  declarations: [
    DashboardLiveComponent
  ],
  imports: [
    CommonModule,
    TesoreriaRoutingModule
  ]
})
export class TesoreriaModule { }
