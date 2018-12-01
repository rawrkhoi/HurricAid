import { Component, OnInit } from '@angular/core';
import { MapsService } from '../service/maps.service';
import { HttpClient } from '@angular/common/http';
import { HelppinComponent } from '../helppin/helppin.component';
import { HavepinComponent } from '../havepin/havepin.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  zoom: number = 8;
  lat: any;
  lng: any;
  markers: any = [];

  haveUrl = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4286f4';
  helpUrl = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF0000';

  constructor(private map: MapsService, private http: HttpClient, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.map.getLocation().subscribe(data => {
      this.lat = data.latitude;
      this.lng = data.longitude;
    });
    // query all the pins from db and push to markers
    this.http.get('/getPins').subscribe((pins: any) => {
      for (let i = 0; i < pins.length; i ++) {
        this.markers.push({
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
    });
  }
  helpBox(): void {
    this.dialog.open(HelppinComponent, {
      width: '500px',
    });
  }
  haveBox(): void {
    this.dialog.open(HavepinComponent, {
      width: '500px',
    });
  }
  // setMsgAddress() {
  //   const supplyTypes = [];
  //   for (let i = 0; i < this.supplyOptions.length; i++) {
  //     if (this.supplyOptions[i].value === true) {
  //       supplyTypes.push(this.supplyOptions[i].id);
  //     }
  //   }
  //   this.message = this.model.message;
  //   this.address = this.model.address;
  //   this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
  //     {
  //       params: {
  //         address: this.address,
  //         key: keys.geocode,
  //       }
  //     })
  //     .subscribe((response: any) => {
  //       const newPin = {
  //         help: this.help,
  //         have: this.have,
  //         message: this.message,
  //         lat: response.results[0].geometry.location.lat,
  //         lng: response.results[0].geometry.location.lng,
  //         address: response.results[0].formatted_address,
  //         supply: supplyTypes,
  //       }
  //       // insert the pin into the database
  //       const headers = new HttpHeaders({
  //         'Content-Type': 'application/json',
  //       });
  //       const options = {
  //         headers,
  //         withCredentials: true
  //       };
  //       this.http.post('/addPin', { pin: newPin }, options).subscribe((data) => {
  //         console.log(data);
  //       });
  //     })
  // }
  // toggleHelp() {
  //   this.help = true;
  //   this.have = false;
  // }
  // toggleHave() {
  //   this.have = true;
  //   this.help = false;
  // }
  // getAddress() {
  //   this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
  //     {
  //       params: {
  //         latlng: `${this.lat},${this.lng}`,
  //         key: keys.geocode,
  //       }
  //     })
  //     .subscribe((response) => {})
  // }
}