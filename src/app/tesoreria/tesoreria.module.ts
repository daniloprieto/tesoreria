import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TesoreriaRoutingModule } from './tesoreria-routing.module';
import { DashboardLiveComponent } from './components/dashboard-live/dashboard-live.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [
    DashboardLiveComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    TesoreriaRoutingModule
  ]
})
export class TesoreriaModule { }
