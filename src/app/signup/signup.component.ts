import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  model: any = {};
  signUpForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    cpassword: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
  });

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }
  moveToMap() {
    this.router.navigate(['/map']);
  }
  moveToLogin() {
    this.router.navigate(['/login']);
  }
  signUp() {
    console.log('clicked');
    if (!this.signUpForm.valid || this.signUpForm.controls.password.value !== this.signUpForm.controls.cpassword.value) {
      console.log('Invalid Form'); return;
    }
    this.userService.signUp(JSON.stringify(this.signUpForm.value))
    .subscribe(data => {
      console.log(data);
      this.router.navigate(['/login']);
    })
    // console.log(JSON.stringify(this.signUpForm.value));
  }
  // signupUser() {
  //   let newObj = {
  //     first_name: this.model.firstName,
  //     last_name: this.model.lastName,
  //     email: this.model.email,
  //     password: this.model.createPassword,
  //     photo_url: this.model.profImg,
  //     emergency_contact: this.model.emergencyContact,
  //     phone_id: this.model.addPhone,
  //     address: this.model.address
  //   }
  //   console.log(newObj);
  //   this.http.post('/signup', newObj);
  // }

}
