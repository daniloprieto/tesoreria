import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public error = {
    user:'',
    password:''
  };

  constructor(
    private _auth: AuthService,
    private formBuilder: FormBuilder,
  ) { 
    this.buildForm()
  }

  ngOnInit(): void {
  }

  private buildForm(){
    this.loginForm = this.formBuilder.group({
      user: ['', [Validators.required, Validators.minLength(5)] ],
      password: ['', [Validators.required, Validators.minLength(8)] ]
    });
  }

  login(event: Event){
    event.preventDefault();

    if (this.loginForm.get('user')!.valid && this.loginForm.get('password')!.valid) {

      this._auth.signIn(this.loginForm.get('user')?.value, this.loginForm.get('password')?.value);

    }else{

      this.checkData();
    }
  }

  checkData(){
    if ( !this.loginForm.get('user')?.valid ) {
      this.error.user = 'Ingresa un usuario válido';
    }
    if ( this.loginForm.get('password')?.value.length < 8  || !this.loginForm.get('password')?.valid ) {
      this.error.password = 'Mínimo 8 caracteres';
    }

    setTimeout(() => {
      this.error = {
        user:'',
        password:''
      };
    }, 5000);
  }

}
