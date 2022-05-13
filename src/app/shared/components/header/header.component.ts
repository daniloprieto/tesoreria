import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user!: User;
  constructor(private _auth: AuthService) {
    this._auth.user.subscribe((user) => this.user = user)
   }

  ngOnInit(): void {
  }

  logout() {
    window.location.reload();
  }

}
