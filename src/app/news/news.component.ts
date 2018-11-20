import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapsService } from '../maps.service';
import { newsHeaders } from 'config';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  lat: string = '';
  lng: string = '';
  news: {
    time: string,
    desc: string,
  };
  articles: Array<object>;

  constructor(private map: MapsService, private http: HttpClient) { }

  ngOnInit() {
    this.map.getLocation().subscribe(data => {
      console.log(data);
      this.lat = data.latitude;
      this.lng = data.longitude;
      this.http.get((`https://api.predicthq.com/v1/events/?category=community&within=10km@${this.lat},${this.lng}`), 
        { headers: { Authorization: `Bearer ${newsHeaders.Authorization}` }})
          .subscribe((response) => {
            this.news = {
              time: response['results'][1]['updated'],
              desc: response['results'][1]['description'],
            }
            this.articles = response['results'];
          })
    })
  }

}
