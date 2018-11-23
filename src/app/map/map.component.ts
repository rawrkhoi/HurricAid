import { Component, OnInit } from '@angular/core';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  model: any = {};
  message: string;
  food: boolean;
  water: boolean;
  shelter: boolean;
  other: boolean;
  address: string;

  name: any;
  lat: any;
  lng: any;
  addressField: boolean = false;
  help: boolean;
  have: boolean;
  zoom: number = 10;
  markers: any = [
    {
      name: 'Baton Rouge',
      lat: '30.443319',
      lng: '-91.187492',
      help: false,
    },
    {
      name: 'New Orleans',
      lat: '29.951065',
      lng: '-90.071533',
      help: true,
    },
    {
      name: 'Shreveport',
      lat: '32.525150',
      lng: '-93.750175',
      help: false,
    }
  ]
  constructor(private map: MapsService) { }

  ngOnInit() {
    this.map.getLocation().subscribe(data => {
      console.log(data);
      this.name = data.city;
      this.lat = data.latitude;
      this.lng = data.longitude;
    })
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
    console.log('markers', this.markers)
  }
  markerClicked(marker:any, index:number){
    console.log(`Marker: ${marker.name}, Index:${index}`)
  }
  createHelp() {
    const newHelpPin = {
      message: this.model.message,
      lat: this.model.lat,
      lng: this.model.lng,
      address: this.model.address,
      help: true,
    }
    console.log(newHelpPin);
    this.markers.push(newHelpPin);
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
}
