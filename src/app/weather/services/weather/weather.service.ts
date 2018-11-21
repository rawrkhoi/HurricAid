import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { keys } from '../../../../../config';

interface Location {
  latitude: string;
  longitude: string;
}

@Injectable()
export class WeatherService {

  // readonly ROOT_URL = `https://api.darksky.net/forecast/${keys.darkSkyApi}/`;

  constructor(private http: HttpClient) {
  }

  // currentForecast(lat: number, lng: number): Observable<any> {
  //   let params = new HttpParams()
  //   params = params.set('lat', lat.toString())
  //   params = params.set('lng', lng.toString())

  //   return this.http.get(this.ROOT_URL, { params })
  // }
  currentForecast() {
    return this.http.get<Location>(`https://api.darksky.net/forecast/${keys.darkSkyApi}/`)
  }

  // getCityWeatherByName(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<string> {
  //   const dataSub = new Subject<string>();
  //   this.http.get(
  //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=952d6b1a52fe15a7b901720074680562`)
  //     .subscribe((data) => {
  //       dataSub.next(data['weather']);
  //     }, (err) => {
  //       console.log(err);
  //     });
  //   return dataSub;
  // }

  // getCitiesWeathersByNames(cities: Array<string>, metric: 'metric' | 'imperial' = 'metric'): Subject<any> {
  //   const citiesSubject = new Subject();
  //   cities.forEach((city) => {
  //     citiesSubject.next(this.http.get(
  //       `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=952d6b1a52fe15a7b901720074680562`));
  //   });
  //   return citiesSubject;
  // }

  // getWeatherState(city: string): Subject<string> {
  //   const dataSubject = new Subject<string>();
  //   this.http.get(
  //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=952d6b1a52fe15a7b901720074680562`)
  //     .subscribe((data) => {
  //       dataSubject.next(data['weather'][0].main);
  //     });
  //   return dataSubject;
  // }

  // getCurrentTemp(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<number> {
  //   const dataSubject = new Subject<number>();
  //   this.http.get(
  //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=952d6b1a52fe15a7b901720074680562`)
  //     .subscribe((weather: any) => {
  //       dataSubject.next(Math.round(Number(weather.main.temp)));
  //     });
  //   return dataSubject;
  // }


  // getCurrentHum(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<number> {
  //   const dataSubject = new Subject<number>();
  //   this.http.get(
  //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=952d6b1a52fe15a7b901720074680562`)
  //     .subscribe((weather: any) => {
  //       console.log(weather);
  //       dataSubject.next(weather.main.humidity);
  //     });
  //   return dataSubject;
  // }


  // getCurrentWind(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<number> {
  //   const dataSubject = new Subject<number>();
  //   this.http.get(
  //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metric}&APPID=952d6b1a52fe15a7b901720074680562`)
  //     .subscribe((weather: any) => {
  //       dataSubject.next(Math.round(Math.round(weather.wind.speed)));
  //     });
  //   return dataSubject;
  // }


  // getMaxTemp(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<number> {
  //   const dataSubject = new Subject<number>();
  //   let max: number;
  //   this.http.get(
  //     `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${metric}&APPID=952d6b1a52fe15a7b901720074680562`)
  //     .subscribe((weather: any) => {
  //       max = weather.list[0].main.temp;
  //       weather.list.forEach((value) => {
  //         if (max < value.main.temp) {
  //           max = value.main.temp;
  //         }
  //       });
  //       dataSubject.next(Math.round(max));
  //     });
  //   return dataSubject;
  // }

  // getMinTemp(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<number> {
  //   const dataSubject = new Subject<number>();
  //   let min: number;
  //   this.http.get(
  //     `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${metric}&APPID=952d6b1a52fe15a7b901720074680562`)
  //     .subscribe((weather: any) => {
  //       min = weather.list[0].main.temp;
  //       weather.list.forEach((value) => {
  //         if (min > value.main.temp) {
  //           min = value.main.temp;
  //         }
  //       });
  //       dataSubject.next(Math.round(min));
  //     });
  //   return dataSubject;
  // }

  // getForecast(city: string, metric: 'metric' | 'imperial' = 'metric'): Subject<Array<any>> {
  //   const dataSubject = new Subject<Array<any>>();
  //   this.http.get(
  //     `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${metric}&APPID=952d6b1a52fe15a7b901720074680562`)
  //     .subscribe((weather: any) => {
  //       dataSubject.next(weather.list);
  //     });
  //   return dataSubject;
  // }

}
