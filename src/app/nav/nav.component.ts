import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  showMenu = false;
  logged: boolean = false;
  name: string = 'Please Log In';

  constructor(private http: HttpClient, private router: Router ) {}

  ngOnInit() {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.http.get('/getInfo').subscribe((info: any) => {
      if (!info){
        this.logged = false;
        this.name = 'Please Log In';
      } else {
        this.logged = true;
        this.name = info.usr.name_first;
      }
    });
  }

  logout(): void {
    this.logged = false;
    this.showMenu = !this.showMenu;
    this.http.get('/logout').subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
