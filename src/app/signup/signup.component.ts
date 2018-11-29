import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupSuccess = false;
  model: any = {};
  signUpForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    })
  }
  moveToLogin() {
    this.router.navigate(['/login']);
  }
  signUp() {
    this.signupSuccess = true;
    this.userService.signUp(this.signUpForm.value).subscribe((data) => {
      console.log(data, 'service');
    })
  }
}
