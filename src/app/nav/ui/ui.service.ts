import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class UiService {

  darkModeState: BehaviorSubject<boolean>;

  constructor() {
    // TODO: if the user is signed in get the default value
    this.darkModeState = new BehaviorSubject<boolean>(false);
  }
}
