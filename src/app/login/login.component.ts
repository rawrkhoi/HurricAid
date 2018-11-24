import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  loginUser() {
    let newObj = {
      email: this.model.email,
      password: this.model.password,
      phone_id: this.model.phone,
    }
    console.log(newObj);
    this.http.post('/login', newObj);
  }
}
