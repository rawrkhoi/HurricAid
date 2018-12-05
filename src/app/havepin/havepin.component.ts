import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { keys } from '../../../config';

@Component({
  selector: 'app-havepin',
  templateUrl: './havepin.component.html',
  styleUrls: ['./havepin.component.css']
})
export class HavepinComponent implements OnInit {

  addr: any;
  model: any = {};
  help: boolean = false;
  have: boolean = false;
  message: string;
  address: string;
  lat: any;
  lng: any;
  suppliesToSend: any = [];
  supplyOptions: any[] = [];

  constructor(private http: HttpClient, private zone: NgZone) { }

  ngOnInit() {
    this.have = true;
    this.help = false;
    this.http.get('/getSupplies').subscribe((supply: any) => {
      supply.map((sup) => {
        sup.value = false;
      })
      this.supplyOptions = supply;
    });
  }
  setAddress(addrObj) {
    this.zone.run(() => {
      this.addr = addrObj;
      this.address = this.addr.formatted_address;
    });
  }
  setMsgAddress() {
    const supplyTypes = [];
    for (let i = 0; i < this.supplyOptions.length; i++) {
      if (this.supplyOptions[i].value === true) {
        supplyTypes.push(this.supplyOptions[i].id);
      }
    }
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
          supply: supplyTypes,
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
          console.log(data);
        });
      })
  }
}
