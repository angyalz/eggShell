import { Component, Inject, Input } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { UserLoggedIn } from 'src/app/common/models/user.model';
import { environment } from 'src/environments/environment';
import { Notice } from '../models/notification.model';
import { NavComponent, SnackbarData } from '../nav.component';
import { NotificationService } from '../services/notification.service';

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
  ) { }

    acceptRequest(): void {

    }

    rejectRequest(): void {

    }

    acceptInvite(): void {

    }

    rejectInvite(): void {

    }
}
