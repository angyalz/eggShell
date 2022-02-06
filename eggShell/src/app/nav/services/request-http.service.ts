import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/common/models/user.model';
import { BaseHttpService } from 'src/app/common/services/base-http.service';
import { UserService } from 'src/app/common/services/user.service';
import { Notice } from '../models/notification.model';

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
    return this.http.post<User>(`${this.BASE_URL}${this.entity}`, { targetUserId: targetUserId, applicantId: applicantId })
      .pipe(
        tap({
          next: (data: User) => { this.userService.setUserData(data) }
        })
      )
  }

  acceptConnectionRequest(requestId: string): Observable<User> {
    return this.http.patch<User>(`${this.BASE_URL}${this.entity}/${requestId}`, 'accept')
      .pipe(
        tap({
          next: (data: User) => { this.userService.setUserData(data) }
        })
      )
  }

  rejectConnectionRequest(requestId: string): Observable<User> {
    return this.http.delete<User>(`${this.BASE_URL}${this.entity}/${requestId}`)
      .pipe(
        tap({
          next: (data: User) => { this.userService.setUserData(data) }
        })
      )
  }

}
