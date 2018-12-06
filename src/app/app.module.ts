import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { keys } from '../../config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { ProfileComponent } from './profile/profile.component';
import { NewsComponent } from './news/news.component';
import { InfoComponent } from './info/info.component';
import { NavComponent } from './nav/nav.component';
import { SplashComponent } from './splash/splash.component';
import { FirstnameComponent } from './profile/components/firstname/firstname.component';
import { LastnameComponent } from './profile/components/lastname/lastname.component';
import { EmailComponent } from './profile/components/email/email.component';
import { PhoneComponent } from './profile/components/phone/phone.component';
import { PasswordComponent } from './profile/components/password/password.component';
import { HelppinComponent } from './helppin/helppin.component';
import { HavepinComponent } from './havepin/havepin.component';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { UiService } from './service/ui.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GooglePlacesDirective } from './google-places.directive';
import {
  MatFormFieldModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  MatInputModule,
  MatRadioModule,
  MatDialogModule,
  MatIconModule,
  MatAutocompleteModule,
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    MapComponent,
    ProfileComponent,
    NewsComponent,
    InfoComponent,
    NavComponent,
    SplashComponent,
    FirstnameComponent,
    LastnameComponent,
    EmailComponent,
    PhoneComponent,
    PasswordComponent,
    HelppinComponent,
    HavepinComponent,
    GooglePlacesDirective,
  ],
  imports: [
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
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: `${keys.googleMaps}`,
      libraries: ['places']
    })
  ],
  entryComponents: [
    FirstnameComponent,
    LastnameComponent,
    EmailComponent,
    PhoneComponent,
    PasswordComponent,
    HelppinComponent,
    HavepinComponent,
  ],
  providers: [
    UiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
