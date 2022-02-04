import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserHttpService extends BaseHttpService<User>{

  constructor(
    public override http: HttpClient
  ) {
    super(http);
    this.entity = 'users'
  }

  checkUserByEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}${this.entity}`, {'email': email});
  }

  setConnectionRequest(user: string, id: string): Observable<any> {
    return this.http.patch<any>(`${this.BASE_URL}${this.entity}/${id}`, { '_id': user });
  }

}
