import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from 'src/app/common/services/user.service';
import { Notice } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  // notificationList: string[] = [];
  private notificationSubject: BehaviorSubject<Notice[]> = new BehaviorSubject<Notice[]>([]);
  private notificationCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private userService: UserService,
  ) { 
    this.getUserData();
  }

  getUserData() : void {
    let noticeList: Notice[] = this.notificationSubject.value;
    this.userService.getUserData().subscribe({
      next: (user) => { 
        console.log('%cUser at notService: ', 'color:blue', user);   // debug
        noticeList = [];
        if (user && !user.pendingRequests?.length && !user.pendingInvitations?.length) {
          console.log('%cNotlists are empty', 'color:blue');  // debug
          this.notificationSubject.next([]);
          this.notificationCounter.next(0);
        }
        if (user && user.pendingRequests) {
          for (let notice of user.pendingRequests) {
            let data: Notice = {...notice, type: 'request'}
            noticeList.push(data);
          }
          this.notificationSubject.next(noticeList);
          this.notificationCounter.next(noticeList.length);
        }
        if (user && user.pendingInvitations) {
          for (let notice of user.pendingInvitations) {
            let data: Notice = { ...notice, type: 'invite' }
            noticeList.push(data);
          }
          this.notificationSubject.next(noticeList);
          this.notificationCounter.next(noticeList.length);
        }
        console.log('%cUser at notService: ', 'color:blue', user);   // debug
        console.log('%cNoticeList at service: ', 'color:blue', noticeList);   // debug
      }
    })
  }

  getNotificationSubject(): Observable<Notice[]> {
    return this.notificationSubject.asObservable();
  }

  getNotificationCounter(): Observable<number> {
    return this.notificationCounter.asObservable();
  }
}
