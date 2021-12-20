import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../barton.component';

@Component({
  selector: 'app-poultry-dialog',
  templateUrl: './poultry-dialog.component.html',
  styleUrls: ['./poultry-dialog.component.scss']
})
export class PoultryDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PoultryDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

  ngOnInit(): void {
  }

}
