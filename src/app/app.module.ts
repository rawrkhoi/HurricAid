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
<<<<<<< HEAD

=======
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatFormFieldModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  MatInputModule,
  MatRadioModule,
} from '@angular/material';
>>>>>>> 842f5e887e551a9b6043b55d336fec33cf5da48a

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
<<<<<<< HEAD
    NavComponent, 
=======
    NavComponent,
>>>>>>> 842f5e887e551a9b6043b55d336fec33cf5da48a
  ],
  imports:[
    CommonModule,
    NgtUniversalModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
<<<<<<< HEAD
=======
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
>>>>>>> 842f5e887e551a9b6043b55d336fec33cf5da48a
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
