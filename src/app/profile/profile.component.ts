import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FirstnameComponent} from './components/firstname/firstname.component';
import { LastnameComponent} from './components/lastname/lastname.component';
import { EmailComponent} from './components/email/email.component';
import { PhoneComponent} from './components/phone/phone.component';
import { PasswordComponent} from './components/password/password.component';
import { HttpClient } from '@angular/common/http';

export interface DialogData {

}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  nameFirst: string;
  nameLast: string;
  email: string;
  number: string;
  
  constructor(public dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    this.http.get('/getInfo').subscribe((info: any) => {
      this.nameFirst = info.usr.name_first;
      this.nameLast = info.usr.name_last;
      this.email = info.email;
      this.number = info.phoneNum;
    });
  }

  editFirst(): void {
    const dialogRef = this.dialog.open(FirstnameComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editLast(): void {
    const dialogRef = this.dialog.open(LastnameComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editEmail(): void {
    const dialogRef = this.dialog.open(EmailComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editPhone(): void {
    const dialogRef = this.dialog.open(PhoneComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editPassword(): void {
    const dialogRef = this.dialog.open(PasswordComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
