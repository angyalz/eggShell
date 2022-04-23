import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, Observable, Subject, take } from 'rxjs';
import { ConfirmPopupComponent } from '../confirm-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmPopupService {

  constructor(
    public dialog: MatDialog,
  ) { }

  async confirmDialog( message: string, actionButtonLabel: string, cancelButtonLabel?: string ): Promise<boolean> {

    const dialogRef = await this.dialog.open(ConfirmPopupComponent, {
      data: {
        message: message,
        actionButtonLabel: actionButtonLabel,
        cancelButtonLabel: cancelButtonLabel
      }
    });

    return await firstValueFrom(dialogRef.afterClosed());
    
  }

}
