import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }
  moveToMap() {
    this.router.navigate(['/map']);
  }
  login() {
    if (!this.loginForm.valid) {
      console.log('Invalid'); return;
    }
    this.authService.login(JSON.stringify(this.loginForm.value))
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['/map']);
      },
        error => { console.log(error); }
      )
    // console.log(JSON.stringify(this.loginForm.value));
  }
}
