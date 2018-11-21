import { Component, OnInit } from '@angular/core';
import { keys } from '../../../config';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  showMenu = false;
  darkModeActive: boolean;

  constructor() { }

  ngOnInit() {
  }

}
