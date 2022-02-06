import { Component, Inject, Input } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { User, UserLoggedIn } from 'src/app/common/models/user.model';
import { UserService } from 'src/app/common/services/user.service';
import { environment } from 'src/environments/environment';
import { Notice } from '../models/notification.model';
import { NavComponent, SnackbarData } from '../nav.component';
import { NotificationService } from '../services/notification.service';
import { RequestHttpService } from '../services/request-http.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  @Input() notice!: Notice;
  @Input() index!: number;

  URL = environment.apiUrl;

  constructor(
    // @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    // private _snackBarRef: MatSnackBarRef<NavComponent>,
    // private notification: NotificationService,
    private requestHttpService: RequestHttpService,
  ) { 
    console.log('%cNotice:', 'color:purple', this.notice); // debug
  }

    acceptRequest(): void {

    }

    rejectRequest(requestId: string): void {
      this.requestHttpService.rejectConnectionRequest(requestId).subscribe({
        next: () => {},
        error: (err) => { console.error(err) }
      })
    }

    acceptInvite(): void {

    }

    rejectInvite(): void {

    }
}
