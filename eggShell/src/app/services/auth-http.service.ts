import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService  {

  BASE_URL = environment.apiUrl;

  constructor(public http: HttpClient) {
  }

  // regNewUser(user: any): Observable<User> {
  //   return this.http.post<User>(`${this.BASE_URL}register`, user);
  // }
}
