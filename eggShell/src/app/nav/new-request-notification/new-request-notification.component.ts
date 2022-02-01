import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NavComponent, SnackbarData } from '../nav.component';


@Component({
  selector: 'app-new-request-notification',
  templateUrl: './new-request-notification.component.html',
  styleUrls: ['./new-request-notification.component.scss']
})
export class NewRequestNotificationComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private _snackBarRef: MatSnackBarRef<NavComponent>,
  ) { }

  dismiss(): void {
    this._snackBarRef.dismiss();
  }

}
