import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FirstnameComponent} from './components/firstname/firstname.component';
import { LastnameComponent} from './components/lastname/lastname.component';
import { EmailComponent} from './components/email/email.component';
import { PhoneComponent} from './components/phone/phone.component';
import { PasswordComponent} from './components/password/password.component';
import { ManageComponent } from './components/manage/manage.component';
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

  managePins(): void {
    this.dialog.open(ManageComponent, {
      width: '300px'
    })
  }

}
