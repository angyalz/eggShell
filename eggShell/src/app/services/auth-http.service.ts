import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService extends BaseHttpService<User> {

  constructor(public http: HttpClient) {
    super(http);
    this.entity = 'user';
  }

  // getClassroomBySchoolId(id: string): Observable<Classroom[]> {
  //   return this.http.get<Classroom[]>(`${this.BASE_URL}${this.entity}/classes/${id}`)
  // }

  // getUsers(): Observable<any> {
  //   return this.http.get(`${this.BASE_URL}users`)
  // }
  regNewUser(user: any): Observable<User> {
    return this.http.post<User>(`${this.BASE_URL}register`, user);
  }
}
