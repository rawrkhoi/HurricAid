import { Component, OnInit } from '@angular/core';
import { MapsService } from '../maps.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { keys } from '../../../config';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  model: any = {};
  
  addressField: boolean = false;
  help: boolean;
  have: boolean;
  food: boolean;
  water: boolean;
  shelter: boolean;
  other: boolean;

  message: string;
  address: string;
  name: any;
  lat: any;
  lng: any;
  markers: any;

  constructor(private map: MapsService, private http: HttpClient) { }

  ngOnInit() {
    this.map.getLocation().subscribe(data => {
      this.message = data.city;
      this.lat = data.latitude;
      this.lng = data.longitude;
    })
    // query all the pins from db and push to markers
    this.http.get('/getHelpPins').subscribe((pins) => {
      this.markers = pins;
    }); 
  }
  mapClicked(event) {
    console.log(`Map clicked at latitude:${event.coords.lat} an longitude:${event.coords.lng}`)
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    let newMarker = {
      name:"New Marker",
      lat: event.coords.lat,
      lng: event.coords.lng,
      help: false,
    }
    this.markers.push(newMarker);
  }
  // markerClicked(marker:any, index:number){
  //   console.log(`Marker: ${marker.name}, Index:${index}`)
  // }
  createHelp() {
    this.message = this.model.message;
    this.address = this.model.address;
    // this.lat = this.model.lat;
    // this.lng = this.model.lng;
    this.help = true;

    this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
      { params: {
        address: this.address,
        key: keys.geocode,
      }
    })
      .subscribe((response: any) => {
        console.log(response.results);
        const newHelpPin = {
          message: this.model.message,
          lat: response.results[0].geometry.location.lat,
          lng: response.results[0].geometry.location.lng,
          address: response.results[0].formatted_address,
        }
        // this.markers.push(newHelpPin);
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
      })
  }
  createHave() {
    const newHavePin = {
      message: this.model.message,
      food: false,
      water: false,
      shelter: false,
      other: false,
      message_other: this.model.message_other,
      lat: this.model.lat,
      lng: this.model.lng,
      address: this.model.address,
      help: false,
    }
    console.log(newHavePin);
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
  // getCoords() {
  //   this.http.get((`https://maps.googleapis.com/maps/api/geocode/json`),
  //     { params: {
  //       address: this.address,
  //       key: keys.geocode,
  //     }
  //   })
  //     .subscribe((response: any) => {
  //       console.log(response.results);
  //       const newHelpPin = {
  //         message: this.model.message,
  //         lat: response.results[0].geometry.location.lat,
  //         lng: response.results[0].geometry.location.lng,
  //         address: response.results[0].formatted_address,
  //       }
  //       this.markers.push(newHelpPin);
  //       console.log(newHelpPin);
  //       // insert the pin into the database
  //       this.http.post('/test', newHelpPin).subscribe((data) => {
  //         console.log(data);
  //       });
  //     })
  // }
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
