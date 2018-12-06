import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { keys } from '../../../config';

@Component({
  selector: 'app-helppin',
  templateUrl: './helppin.component.html',
  styleUrls: ['./helppin.component.css']
})
export class HelppinComponent implements OnInit {

  addr: any;
  model: any = {};
  help: boolean = false;
  have: boolean = false;
  message: string;
  address: string;
  lat: any;
  lng: any;
  markers: any = [];

  constructor(private http: HttpClient, private zone: NgZone) { }

  ngOnInit() {
    this.help = true;
    this.have = false;
  }
  setAddress(addrObj) {
    this.zone.run(() => {
      this.addr = addrObj;
      this.address = this.addr.formatted_address;
    });
    console.log(this.address)
  }
  setMsgAddress() {
    this.message = this.model.message;
    this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
      {
        params: {
          address: this.address,
          key: keys.geocode,
        }
      })
      .subscribe((response: any) => {
        const newPin = {
          help: this.help,
          have: this.have,
          message: this.message,
          lat: response.results[0].geometry.location.lat,
          lng: response.results[0].geometry.location.lng,
          address: response.results[0].formatted_address,
        }
        // insert the pin into the database
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        const options = {
          headers,
          withCredentials: true
        };
        this.http.post('/addPin', { pin: newPin }, options).subscribe((data) => {
          location.reload();
        });
      })
  }
}
