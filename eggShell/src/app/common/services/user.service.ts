import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLoggedIn } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = environment.apiUrl;
  private userData$: BehaviorSubject<UserLoggedIn | null> = new BehaviorSubject<UserLoggedIn | null>(null);

  constructor() { }
}
