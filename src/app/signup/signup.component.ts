import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  model: any = {};
  // email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  // getErrorMessage() {
  //   return this.email.hasError('required') ? 'You must enter a value' :
  //     this.email.hasError('email') ? 'Not a valid email' : '';
  // }
  signupUser() {
    let newObj = {
      first_name: this.model.firstName,
      last_name: this.model.lastName,
      email: this.model.email,
      password: this.model.createPassword,
      photo_url: this.model.profImg,
      emergency_contact: this.model.emergencyContact,
      phone_id: this.model.addPhone,
      address: this.model.address
    }
    console.log(newObj);
    this.http.post('/signup', newObj);
  }

}
