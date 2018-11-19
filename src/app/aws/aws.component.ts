import { Component, OnInit } from '@angular/core';
// import entire SDK
import AWS = require('aws-sdk');
// import AWS object without services
import AWS = require('aws-sdk/global');
// import individual service
import S3 = require('aws-sdk/clients/s3');


@Component({
  selector: 'app-aws',
  templateUrl: './aws.component.html',
  styleUrls: ['./aws.component.css']
})
export class AwsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
