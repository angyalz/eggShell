import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/common/models/user.model';
import { BaseHttpService } from 'src/app/common/services/base-http.service';
import { UserService } from 'src/app/common/services/user.service';
import { Notice } from '../models/notification.model';

export class AcceptBartonList {

  id: string;
  role: 'admin' | 'user';

  constructor(

    id: string,
    role: 'admin' | 'user'

  ) {

    this.id = id;
    this.role = role;

  }
}

export class AcceptRequestData {

  userId: string;
  targetUserId: string;
  bartonDataList: AcceptBartonList[];

  constructor(

    userId: string,
    targetUserId: string,
    bartonDataList: AcceptBartonList[]

  ) {

    this.userId = userId;
    this.targetUserId = targetUserId;
    this.bartonDataList = bartonDataList;

  }
}

@Injectable({
  providedIn: 'root'
})
export class RequestHttpService extends BaseHttpService<Notice> {

  constructor(
    public override http: HttpClient,
    private userService: UserService,
  ) {
    super(http);
    this.entity = 'share/request'
  }

  sendConnectionRequest(applicantId: string, targetUserId: string): Observable<User> {
    return this.http.post<User>(`${this.BASE_URL}${this.entity}/${targetUserId}`, { user: applicantId })
      .pipe(
        tap({
          next: (data: User) => { if (data) this.userService.setUserData(data) }
        })
      )
  }

  acceptConnectionRequest(requestId: string, data: AcceptRequestData): Observable<User> {
    return this.http.patch<User>(`${this.BASE_URL}${this.entity}/${requestId}`, data)
      .pipe(
        tap({
          next: (data: User) => { if (data) this.userService.setUserData(data) }
        })
      )
  }

  rejectConnectionRequest(requestId: string): Observable<User> {
    return this.http.delete<User>(`${this.BASE_URL}${this.entity}/${requestId}`)
      .pipe(
        tap({
          next: (data: User) => { if (data) this.userService.setUserData(data) }
        })
      )
  }

}
