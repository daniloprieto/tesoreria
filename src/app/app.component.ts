import { Component } from '@angular/core';
import { AlertService } from './core/services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gilgal';
  showAlert = false;
  message='';

  constructor(private _alert: AlertService) { }

  ngOnInit(): void {
    this._alert.alert$.subscribe(
      (res: any) => {
        this.message = res.message
        this.showAlert = true;

        setTimeout(() => {
          this.showAlert = false;
        }, res.time);
      }
    )
  }
}
