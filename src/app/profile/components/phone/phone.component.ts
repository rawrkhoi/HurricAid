import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit {
  model: any = {};
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  updatePhone(){
    console.log(this.model.phone);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers,
      withCredentials: true
    };
    this.http.post('/updateInfo', { phone: this.model.phone }, options).subscribe((data) => {
      console.log(data);
    });
  }
}
