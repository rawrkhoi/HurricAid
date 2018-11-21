import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  model: any = {};
  

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  signupUser() {
    let newObj = {
      first_name: this.model.firstName,
      last_name: this.model.lastName,
      email: this.model.email,
      password: this.model.createPassword,
      photo_url: this.model.profImg,
      emergency_contact: this.model.emergencyContact,
      phone_id: this.model.addPhone,
      location_id: {
        city: this.model.city,
        state: this.model.state,
        zip: this.model.zip
      }
    }
    console.log(newObj);
    this.http.post('/signup', newObj);
  }

}
