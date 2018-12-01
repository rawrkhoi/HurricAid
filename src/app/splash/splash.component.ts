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

  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
  }
  moveToMap() {
    this.router.navigate(['/map']);
  }
  loginBox(): void {
    this.dialog.open(LoginComponent, {
      width: '300px',
    });
  }
  signUpBox(): void {
    this.dialog.open(SignupComponent, {
      width: '300px',
    });
  }
  info() {
    this.dialog.open(InfoComponent, {
      width: '300px',
    });
  }
}
