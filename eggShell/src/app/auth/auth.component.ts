import { Component, Inject } from '@angular/core';
import { DialogData } from 'src/app/nav/nav.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  tabIndex: number = this.data.tabIndex;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

}
