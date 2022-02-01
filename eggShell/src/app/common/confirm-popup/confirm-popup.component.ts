import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { DialogData } from 'src/app/nav/nav.component';

export interface ConfirmDialogData {
  // actionConfirm: boolean,
  message: string,
  actionButtonLabel: string,
  cancelButtonLabel?: string,
}

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
