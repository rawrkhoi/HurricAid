import { Component, OnInit } from '@angular/core';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  lat: string = '';
  lng: string = '';

  location: Object;

  constructor(private map: MapsService) { }

  ngOnInit() {
    this.map.getLocation().subscribe(data => {
      console.log(data);
      this.lat= data.latitude;
      this.lng = data.longitude;
    })
  }

}
