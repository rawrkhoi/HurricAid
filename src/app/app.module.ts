import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { keys } from '../../config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { ProfileComponent } from './profile/profile.component';
import { NewsComponent } from './news/news.component';
import { InfoComponent } from './info/info.component';
import { NavComponent } from './nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { UiService } from './nav/ui/ui.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatFormFieldModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  MatInputModule,
  MatRadioModule,
  MatDialogModule,
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    SignupComponent,
    LoginComponent,
    MapComponent,
    ProfileComponent,
    NewsComponent,
    InfoComponent,
    NavComponent,
  ],
  imports:[
    CommonModule,
    NgtUniversalModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    AgmCoreModule.forRoot({
      apiKey: `${keys.googleMaps}`
    })
  ],
  providers: [
    UiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
