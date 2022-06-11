import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-dashboard-live',
  templateUrl: './dashboard-live.component.html',
  styleUrls: ['./dashboard-live.component.scss']
})
export class DashboardLiveComponent implements OnInit {
  public isLoading = this._ticket.loading;
  user!: User;
  constructor(
    private _auth: AuthService,
    private _ticket: TicketService,
  ) {
    this._auth.user.subscribe((user) => this.user = user)
   }

  ngOnInit(): void {
  }

  logout() {
    window.location.reload();
  }

}
