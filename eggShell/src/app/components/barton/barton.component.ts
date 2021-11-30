import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PoultryDialogComponent } from './poultry-dialog/poultry-dialog.component';

export interface DialogData {
  qty: number;
  name: string;
}

@Component({
  selector: 'app-barton',
  templateUrl: './barton.component.html',
  styleUrls: ['./barton.component.scss']
})
export class BartonComponent implements OnInit {

  isOpen: boolean = false;
  selectedItem: any;

  URL = environment.apiUrl;

  barton: Array<any> = [];
  poultry: Array<any> = [
    {
      species: 'tyúk',
      image: `${this.URL}images/poultries/hen.png`,
      qty: 6,
      isOpen: false,
    },
    {
      species: 'kakas',
      image: `${this.URL}images/poultries/rooster2.png`,
      qty: 1,
      isOpen: false,
    },
    {
      species: 'kacsa',
      image: `${this.URL}images/poultries/duck2.png`,
      qty: 2,
      isOpen: false,
    },
    {
      species: 'gácsér',
      image: `${this.URL}images/poultries/duck1.png`,
      qty: 1,
      isOpen: false,
    }
  ];
  // poultryToMove = [...this.poultry];
  // poultryToMove = [...this.poultry];
  
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  
  // this.barton = [...this.barton, this.isOpen];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // transferArrayItem(
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    // this.barton.qty = 
    // this.poultryToMove = [...this.poultry];
    console.log('event at drop: ', event);
    console.log('barton at drop: ', this.barton);
    console.log('poultry at drop: ', this.poultry);
  }

  openDialog(item: any, i: number): void {
    const dialogRef = this.dialog.open(PoultryDialogComponent, {
      // width: '250px',
      data: { qty: item.qty, name: item.customName },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log('The dialog was closed');
      console.log('DialogResult: ', result);
      this.barton[i].qty = result.qty;
      this.barton[i].customName = result.customName;
    });
  }

  openMenu(i: number, item?: any) {   // debug item
    // for (this.isOpen of this.barton) {
    //   this.isOpen = false;
    // }
    console.log('barton: ', this.barton, i); // debug
    console.log('item at openMenu: ', item); // debug
    // console.log(cdkConnectedOverlayOpen); // debug
    // this.barton[i].isOpen = !this.barton[i].isOpen;
    // return this.barton[i].isOpen = !this.barton[i].isOpen;
  }

}
