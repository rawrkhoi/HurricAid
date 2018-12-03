import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { InfoComponent } from '../info/info.component';
import { Router } from '@angular/router';

export interface DialogData {

}

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
  animal: string;
  name: string;
  
  imgSrc: string = '../../hurricane.png'; 
  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
  }
  moveToMap() {
    this.router.navigate(['/map']);
  }
  loginBox(): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }
  signUpBox(): void {
    this.dialog.open(SignupComponent, {
      width: '400px',
    });
  }
  info() {
    this.dialog.open(InfoComponent, {
      width: '300px',
    });
  }
}
