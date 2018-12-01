import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-lastname',
  templateUrl: './lastname.component.html',
  styleUrls: ['./lastname.component.css']
})
export class LastnameComponent implements OnInit {
  model: any = {};
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  updateLast(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers,
      withCredentials: true
    };
    this.http.post('/updateInfo', { lastName: this.model.last }, options).subscribe((data) => {
      console.log(data);
    });
  }
}
