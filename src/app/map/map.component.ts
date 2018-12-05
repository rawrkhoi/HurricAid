import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapsService } from '../service/maps.service';
import { HttpClient } from '@angular/common/http';
import { HelppinComponent } from '../helppin/helppin.component';
import { HavepinComponent } from '../havepin/havepin.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  model: any = {};
  loggedIn: boolean = false;
  zoom: number = 12;
  lat: any;
  lng: any;
  supplyOptions: any = [];
  markers: any = [];
  haveUrl = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4286f4';
  helpUrl = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF0000';

  constructor(
    private map: MapsService,
    private http: HttpClient,
    public dialog: MatDialog,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.http.get('/getInfo').subscribe((info: any) => {
      if (!info) {
        this.loggedIn = false;
      } else {
        this.loggedIn = true;
      }
    });

    this.http.get('/getSupplies').subscribe((supply: any) => {
      supply.map((sup) => {
        sup.value = false;
      })
      this.supplyOptions = supply;
    });

    // location by browser or by ip if error or navigator unavailable
    const success = (position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    }

    const error = () => {
      this.map.getLocation().subscribe(data => {
        this.lat = data.latitude;
        this.lng = data.longitude;
      });
    }

    navigator.geolocation.getCurrentPosition(success, error);

    if (!navigator.geolocation || (!this.lat && !this.lng)) {
      this.map.getLocation().subscribe(data => {
        this.lat = data.latitude;
        this.lng = data.longitude;
      });
    }
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
  ngOnDestroy() {
    this.markers = [];
  }
  sendSupply() {
    this.ngOnDestroy();
    this.http.post('/filterPinsBySupply', { supplyId: this.model.selectSupply })
    .subscribe((pins: any) => {
      for (let i = 0; i < pins.length; i++) {
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
    const dialogRef = this.dialog.open(HelppinComponent, {
      width: '380px',
    });
    this.ngOnDestroy();
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.ngOnInit();
      }, 3000);
    });
  }
  haveBox(): void {
    const dialogRef = this.dialog.open(HavepinComponent, {
      width: '380px',
    });
    this.ngOnDestroy();
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.ngOnInit();
      }, 3000);
    });
  }

  goHelp(id) {
    this.http.post('/goHelp', { phoneId: id}).subscribe(() => {
      console.log('helped');
    });
  }
}