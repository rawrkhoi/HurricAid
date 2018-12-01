import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  model: any = {};
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  updateEmail(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers,
      withCredentials: true
    };
    this.http.post('/updateInfo', { email: this.model.email }, options).subscribe((data) => {
      console.log(data);
    });
  }
}
