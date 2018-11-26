import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

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
  
  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }
  moveToMap() {
    this.router.navigate(['/map']);
  }
  login() {
    if (!this.loginForm.valid) {
      console.log('Invalid'); return;
    }
    this.userService.signUp(JSON.stringify(this.loginForm.value))
      .subscribe(data => {
          console.log(data);
          this.router.navigate(['/map']);
        },
        error => { console.log(error); }
      )
      // console.log(JSON.stringify(this.loginForm.value));
  }
  // loginUser() {
  //   let newObj = {
  //     email: this.model.email,
  //     password: this.model.password,
  //     phone_id: this.model.phone,
  //   }
  //   console.log(newObj);
  //   this.http.post('/login', newObj);
  // }
}
