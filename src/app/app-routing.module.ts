import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component'
import { LoginComponent } from './login/login.component'
import { MapComponent } from './map/map.component'
import { NewsComponent } from './news/news.component'
import { WeatherComponent } from './weather/weather.component'
import { InfoComponent } from './info/info.component'
import { ProfileComponent } from './profile/profile.component'
import { SplashComponent } from './splash/splash.component'

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'map', component: MapComponent },
  { path: 'weather', component: WeatherComponent },
  { path: 'news', component: NewsComponent },
  { path: 'info', component: InfoComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', component: SplashComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
