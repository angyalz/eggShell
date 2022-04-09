import { Component, Input, OnDestroy } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Observable, Subscription } from 'rxjs';
import { Barton } from 'src/app/barton/models/barton.model';
import { BartonService } from 'src/app/barton/services/barton.service';
import { User } from 'src/app/common/models/user.model';
import { UserService } from 'src/app/common/services/user.service';
import { environment } from 'src/environments/environment';
import { HU_FORMATS } from '../../egg/add-egg/add-egg.component';
import { Notice } from '../models/notification.model';
import { AcceptBartonList, AcceptRequestData, RequestHttpService } from '../services/request-http.service';

class AcceptData {

  checked: boolean;
  id: string;
  role: boolean;

  constructor(checked: boolean, id: string, role: boolean) {
    this.checked = checked;
    this.id = id;
    this.role = role;
  }
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'hu' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: HU_FORMATS },
  ]
})
export class NotificationComponent implements OnDestroy {

  @Input() notice!: Notice;
  @Input() index!: number;

  URL = environment.apiUrl;

  bartonsData!: Barton[];
  bartonsData$: Observable<Barton[]> = this.bartonService.getBartonList();
  bartonSubscribe: Subscription = this.bartonService.getBartonList().subscribe(data => this.bartonsData = data);
  userData!: User | null;
  userData$: Observable<User | null> = this.userService.getUserData();
  userSubscribe: Subscription = this.userService.getUserData().subscribe(data => this.userData = data);
  setInitDataSubscribe!: Subscription;

  acceptBartonList: AcceptData[] = [];
  ownBartons: Barton[] = [];

  allChecked: boolean = true;

  panelToggle: boolean = false;

  constructor(
    private bartonService: BartonService,
    private userService: UserService,
    private requestHttpService: RequestHttpService,
  ) {}

  ngOnDestroy(): void {
    if (this.bartonSubscribe) this.bartonSubscribe.unsubscribe();
    if (this.userSubscribe) this.userSubscribe.unsubscribe();
    if (this.setInitDataSubscribe) this.setInitDataSubscribe.unsubscribe();
  }

  acceptRequest(requestId: string, data: AcceptRequestData): void {
    console.log('%cacceptRequest data: ', 'color:deeppurple', requestId, data);     // debug
    this.requestHttpService.acceptConnectionRequest(requestId, data).subscribe({
      next: () => { },
      error: (err) => { console.error(err) }
    })
  }

  rejectRequest(requestId: string): void {
    this.requestHttpService.rejectConnectionRequest(requestId).subscribe({
      next: () => { },
      error: (err) => { console.error(err) }
    })
  }

  acceptInvite(): void {

  }

  rejectInvite(): void {

  }

  setInitAcceptRequestData(): void {
    let userId!: string;
    if (this.userData) userId = this.userData._id;
    this.ownBartons = this.bartonsData.filter(
      barton => (barton.active === true) && (barton.users.filter(
        users => (users.role === 'owner') && (users.user === userId)
        ).length)
    );

    for (let barton of this.ownBartons) {
      if (barton._id) {
        let initData = new AcceptData(true, barton._id, true)
        this.acceptBartonList.push(Object.assign({}, initData));
      }
    }

    // console.log('%cAcceptBartonList: ', 'color:green', this.acceptBartonList);  // debug
  }

  setRequestData(data: AcceptData[]): AcceptRequestData {

    let acceptRequestData!: AcceptRequestData;
    let bartonsDataList: AcceptBartonList[] = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        let bartonsData = new AcceptBartonList(data[i].id, data[i].role ? 'admin' : 'user')
        bartonsDataList.push(bartonsData);
      }
    }

    if (this.userData && this.notice.user) {
      acceptRequestData = new AcceptRequestData(this.userData._id, this.notice.user._id, bartonsDataList);
    }
    
    return acceptRequestData;

  }

  setAllChecked(completed: boolean): void {
    this.allChecked = completed;
    this.acceptBartonList.forEach(b => b.checked = completed);
  }

  someChecked(): boolean {
    if (this.acceptBartonList == null) {
      return false;
    }
    return this.acceptBartonList.filter(b => b.checked).length > 0 && !this.allChecked;
  }

  updateAllChecked() {
    this.allChecked = this.acceptBartonList != null && this.acceptBartonList.every(b => b.checked);
  }

}
