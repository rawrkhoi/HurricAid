import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  nameFirst: string;
  nameLast: string;
  email: string;
  number: string;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('/getInfo').subscribe((info: any) => {
      this.nameFirst = info.usr.name_first;
      this.nameLast = info.usr.name_last;
      this.email = info.email;
      this.number = info.phoneNum;
    });
  }

}
