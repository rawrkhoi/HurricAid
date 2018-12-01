import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-firstname',
  templateUrl: './firstname.component.html',
  styleUrls: ['./firstname.component.css']
})
export class FirstnameComponent implements OnInit {
  model: any = {};
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  updateFirst(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers,
      withCredentials: true
    };
    this.http.post('/updateInfo', { firstName: this.model.first }, options).subscribe((data) => {
      console.log(data);
    });
  }
}
