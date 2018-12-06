import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FirstnameComponent} from './components/firstname/firstname.component';
import { LastnameComponent} from './components/lastname/lastname.component';
import { EmailComponent} from './components/email/email.component';
import { PhoneComponent} from './components/phone/phone.component';
import { PasswordComponent} from './components/password/password.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

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
  showEdit: boolean = false;
  userPins: any = [];
  display: boolean = true;
  
  constructor(public dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    this.http.get('/getInfo').subscribe((info: any) => {
      this.nameFirst = info.usr.name_first;
      this.nameLast = info.usr.name_last;
      this.email = info.email;
      this.number = info.phoneNum;
    });
    this.http.get('/getPinsByUser').subscribe((pins: any) => {
      if (pins.length !== 0){
        for (let i = 0; i < pins.length; i ++) {
          this.userPins.push({
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
        this.display = false;
      }
    });
  }

  editFirst(): void {
    this.dialog.open(FirstnameComponent, {
      width: '250px',
    });
  }

  editLast(): void {
    this.dialog.open(LastnameComponent, {
      width: '250px',
    });
  }

  editEmail(): void {
    this.dialog.open(EmailComponent, {
      width: '250px',
    });
  }

  editPhone(): void {
    this.dialog.open(PhoneComponent, {
      width: '250px',
    });
  }

  editPassword(): void {
    this.dialog.open(PasswordComponent, {
      width: '300px',
    });
  }
  
  showEdits(): void {
    this.showEdit = !this.showEdit;
  }

  removePin(id): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers,
      withCredentials: true
    };
    this.http.post('/removePin', { pinId: id }, options).subscribe((data) => {
      console.log(data);
    });
    location.reload();
  }

}
