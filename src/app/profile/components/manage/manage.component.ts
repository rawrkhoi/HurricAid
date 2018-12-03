import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor(private http: HttpClient) { }

  userPins: any;
  display: boolean = true;
  
  ngOnInit() {
    this.http.get('/getPinsByUser').subscribe((pins: any) => {
      if (pins.length !== 0){
        this.userPins = pins;
        this.display = false;
      }
    });
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
  }

}
