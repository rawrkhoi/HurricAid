import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather/weather.service';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  showMenu = false;
  darkModeActive: boolean;

  // constructor() { }

  // ngOnInit() {
  // }

  // lat: number;
  // lng: number;
  // forecast: Observable<any>;
  lat: string = '';
  lng: string = '';

  location: Object;

  constructor(private weather: WeatherService) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude.toString();
        this.lng = position.coords.longitude.toString();
      });
    } else {
      /// default coords
      this.lat = '40.73';
      this.lng = '-73.93';
    }
  }

  getForecast() {
    // this.forecast = this.weather.currentForecast(this.lat, this.lng)
    //   .pipe(
    //     tap(data => console.log(data))
    //   );
    this.weather.currentForecast().subscribe(data => {
      console.log('forecast', data);
      this.lat = data.latitude;
      this.lng = data.longitude;
    })
  }


  /// Helper to make weather icons work
  /// better solution is to map icons to an object 
  weatherIcon(icon) {
    switch (icon) {
      case 'partly-cloudy-day':
        return 'wi wi-day-cloudy'
      case 'clear-day':
        return 'wi wi-day-sunny'
      case 'partly-cloudy-night':
        return 'wi wi-night-partly-cloudy'
      default:
        return `wi wi-day-sunny`
    }
  }
}
