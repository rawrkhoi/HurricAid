import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor(private http: HttpClient) { }

  userPins: any = [];
  display: boolean = true;
  
  ngOnInit() {
    this.http.get('/getPinsByUser').subscribe((pins: any) => {
      if (pins.length !== 0){
        for (let i = 0; i < pins.length; i ++) {
          this.userPins.push({
            id: pins[i].id,
            help: pins[i].help,
            have: pins[i].have,
            address: pins[i].address,
            id_phone: pins[i].id_phone,
            latitude: pins[i].latitude,
            longitude: pins[i].longitude,
            message: pins[i].message,
            createdAt: moment(pins[i].createdAt).format('llll'),
            updatedAt: moment(pins[i].updatedAt).format('llll'),
          });
        }
        this.display = false;
      }
    });
  }
  
  removePin(id): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers,
      withCredentials: true
    };
    this.http.post('/removePin', { pinId: id }, options).subscribe((data) => {
      console.log(data);
    });
  }

}
