import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  model: any = {};
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  updatePassword(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers,
      withCredentials: true
    };
    this.http.post('/updateInfo', { password: this.model.password, current: this.model.current }, options).subscribe((data) => {
      console.log(data);
    });
  }
}
