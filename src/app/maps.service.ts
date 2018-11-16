import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Location {
  latitude: string;
  longitude: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http: HttpClient) { }

  getLocation() {
    return this.http.get<Location>('http://api.ipapi.com/api/check?access_key=c187c4dabf5174b442a8820167e7acf0')
  }
}
