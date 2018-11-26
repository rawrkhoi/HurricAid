import { Component, OnInit } from '@angular/core';
import { MapsService } from '../maps.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { keys } from '../../../config';
import * as moment from 'moment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  zoom: number = 8;
  model: any = {};
  
  addressField: boolean = false;
  help: boolean;
  have: boolean;
  food: boolean = false;
  water: boolean = false;
  shelter: boolean = false;
  other: boolean = false;

  message_other: string;
  message: string;
  address: string;
  lat: any;
  lng: any;
  helpMarkers: any = [];
  haveMarkers: any = [];
  tests: any = [
    'food',
    'water',
    'shelter',
    'wifi',
  ];

  constructor(private map: MapsService, private http: HttpClient) { }

  ngOnInit() {
    this.map.getLocation().subscribe(data => {
      this.message = data.city;
      this.lat = data.latitude;
      this.lng = data.longitude;
    })
    // query all the pins from db and push to markers
    this.http.get('/getHelpPins').subscribe((pins: any) => {
      for (let i = 0; i < pins.length; i ++) {
        this.helpMarkers.push({
          address: pins[i].address,
          createdAt: moment(pins[i].createdAt).format('llll'),
          id: pins[i].id,
          id_phone: pins[i].id_phone,
          latitude: pins[i].latitude,
          longitude: pins[i].longitude,
          message: pins[i].message,
          updatedAt: moment(pins[i].updatedAt).format('llll'),
        });
      }
    }); 
    this.http.get('/getHavePins').subscribe((pins: any) => {
      for (let i = 0; i < pins.length; i++) {
        this.haveMarkers.push ({
          address: pins[i].address,
          createdAt: moment(pins[i].createdAt).format('llll'),
          id: pins[i].id,
          id_phone: pins[i].id_phone,
          latitude: pins[i].latitude,
          longitude: pins[i].longitude,
          message: pins[i].message,
          updatedAt: moment(pins[i].updatedAt).format('llll'),
          food: pins[i].food,
          other: pins[i].other,
          shelter: pins[i].shelter,
          water: pins[i].water,
        });
      }
    }); 
  }
  setMsgAddress() {
    this.message = this.model.message;
    this.address = this.model.address;
    this.message_other = this.model.message_other;
    this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
      {
        params: {
          address: this.address,
          key: keys.geocode,
        }
      })
      .subscribe((response: any) => {
        console.log(response.results);
        if (this.help) {
          const newHelpPin = {
            message: this.model.message,
            lat: response.results[0].geometry.location.lat,
            lng: response.results[0].geometry.location.lng,
            address: response.results[0].formatted_address,
          }
          console.log('Help Pin works', newHelpPin);
          // insert the pin into the database
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
          const options = {
            headers,
            withCredentials: true
          };
          this.http.post('/helpPin', { pin: newHelpPin }, options).subscribe((data) => {
            console.log(data);
          });
        }
        if (this.have) {
          const newHavePin = {
            lat: response.results[0].geometry.location.lat,
            lng: response.results[0].geometry.location.lng,
            address: response.results[0].formatted_address,
            food: this.food,
            water: this.water,
            shelter: this.shelter,
            other: this.message_other,
          }
          console.log('Have Pin works', newHavePin);
          // insert the pin into the database
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
          const options = {
            headers,
            withCredentials: true
          };
          this.http.post('/havePin', { pin: newHavePin }, options).subscribe((data) => {
            console.log(data);
          });
        }
      })
  }
  showAddressField() {
    this.addressField = true;
  }
  hideAddressField() {
    this.addressField = false;
  }
  toggleHelp() {
    this.help = !this.help;
  }
  toggleHave() {
    this.have = !this.have;
  }
  toggleFood() {
    this.food = !this.food;
  }
  toggleWater() {
    this.water = !this.water;
  }
  toggleShelter() {
    this.shelter = !this.shelter;
  }
  toggleOther() {
    this.other = !this.other;
  }
  getAddress() {
    this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
      {
        params: {
          latlng: `${this.lat},${this.lng}`,
          key: keys.geocode,
        }
      })
      .subscribe((response) => {
        console.log(response);
      })
  }
}
