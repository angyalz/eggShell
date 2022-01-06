import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

}
