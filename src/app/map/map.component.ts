import { Component, OnInit } from '@angular/core';
import { MapsService } from '../maps.service';
import { Marker } from '@agm/core/services/google-maps-types';
import { AgmMarker } from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  name: string = '';
  lat: any;
  lng: any;

  location: Object;
  
  zoom: number = 10;
  markers = [
    {
      name: 'Baton Rouge',
      lat: '30.443319',
      lng: '-91.187492',
    },
    {
      name: 'New Orleans',
      lat: '29.951065',
      lng: '-90.071533',
    },
    {
      name: 'Shreveport',
      lat: '32.525150',
      lng: '-93.750175',
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
    }
    this.markers.push(newMarker);
    console.log('markers', this.markers)
  }
  markerClicked(marker:Marker, index:number){
    console.log(`Marker: ${marker.name}, Index:${index}`)
  }
}
