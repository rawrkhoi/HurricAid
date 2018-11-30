import { Component, OnInit } from '@angular/core';
import { UiService } from './ui/ui.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  showMenu = false;
  darkModeActive: boolean;

  userEmail: string;
  name: string;

  constructor(public ui: UiService, private http: HttpClient) {

  }

  ngOnInit() {
    this.ui.darkModeState.subscribe((value) => {
      this.darkModeActive = value;
    });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.http.get('/getInfo').subscribe((info: any) => {
      if (!info){
        this.name = 'Please Log In';
      } else {
        this.name = info.usr.name_first;
      }
    });
  }

  modeToggleSwitch() {
    this.ui.darkModeState.next(!this.darkModeActive);
  }

}
