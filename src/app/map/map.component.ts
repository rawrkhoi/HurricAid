import { Component, OnInit } from '@angular/core';
import { MapsService } from '../maps.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, FormArray, ValidatorFn  } from '@angular/forms';
import { keys } from '../../../config';
import * as moment from 'moment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  supply: FormGroup;
  zoom: number = 8;
  model: any = {};
  
  help: boolean = false;
  have: boolean = false;

  message: string;
  address: string;
  lat: any;
  lng: any;
  markers: any = [];
  supplyOptions: any[] = [
    // {id: 1, type: 'food',},
    // {id: 2, type: 'water',}
  ];

  constructor(private map: MapsService, private http: HttpClient, private formBuilder: FormBuilder) {
    const controls = this.supplyOptions.map(c => new FormControl(false));
    console.log(controls);
    // controls[0].setValue(true); // Set the first checkbox to true (checked)
    this.supply = this.formBuilder.group({
      supplyOptions: new FormArray(controls)
    });
  }

  ngOnInit() {
    this.map.getLocation().subscribe(data => {
      this.message = data.city;
      this.lat = data.latitude;
      this.lng = data.longitude;
    });
    this.http.get('/getSupplies').subscribe((supply: any) => {
      this.supplyOptions = supply;
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
  setMsgAddress() {
    this.message = this.model.message;
    this.address = this.model.address;
    this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
      {
        params: {
          address: this.address,
          key: keys.geocode,
        }
      })
      .subscribe((response: any) => {
        console.log(response.results);
        const newPin = {
          help: this.help,
          have: this.have,
          message: this.message,
          lat: response.results[0].geometry.location.lat,
          lng: response.results[0].geometry.location.lng,
          address: response.results[0].formatted_address,
        }
        console.log('Pin works', newPin);
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
  toggleHelp() {
    this.help = true;
    this.have = false;
  }
  toggleHave() {
    this.have = true;
    this.help = false;
  }
  submit() {
    const selectedSupplyIds = this.supply.value.supplyOptions
      .map((v, i) => v ? this.supplyOptions[i].id : null)
      .filter(v => v !== null);

    console.log(selectedSupplyIds);
  }
  getAddress() {
    this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
      {
        params: {
          latlng: `${this.lat},${this.lng}`,
          key: keys.geocode,
        }
      })
      .subscribe((response) => {})
  }
}
