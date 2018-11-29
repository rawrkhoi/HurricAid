import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { ProfileComponent } from '../profile/profile.component';
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
  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
  }
  moveToMap() {
    this.router.navigate(['/map']);
  }
  loginBox(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe();
  }
  signUpBox(): void {
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe();
  }
  info() {
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe();
  }
}
