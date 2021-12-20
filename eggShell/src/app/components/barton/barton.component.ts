import { Component, OnInit, ViewChild, Inject, OnDestroy, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PoultryOfBarton } from 'src/app/models/poultry-of-barton.model';
import { Poultry } from 'src/app/models/poultry.model';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoultryHttpService } from 'src/app/services/poultry-http.service';

export interface DialogData {
  qty: number;
  name: string;
}

@Component({
  selector: 'app-barton',
  templateUrl: './barton.component.html',
  styleUrls: ['./barton.component.scss']
})
export class BartonComponent implements AfterViewInit {

  selectedItem: any;

  URL = environment.apiUrl;

  poultryDB!: PoultryData | null;
  poultryRef!: Poultry[];
  barton: PoultryOfBarton[] = [];
  poultry: PoultryOfBarton[] = [];

  constructor(
    public dialog: MatDialog,
    private poultryHttp: PoultryHttpService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    this.poultryDB = new PoultryData(this.poultryHttp);
    this.poultryDB.getAllPoultry().subscribe({
      next: (data: Poultry[]) => {
        console.log('getAllPoultry data: ', data);    // debug
        this.poultryRef = [...data];
        for (const item of this.poultryRef) {
          item.quantity = 1;
        }
        this.poultry = JSON.parse(JSON.stringify([...this.poultryRef]));
      },
      error: (err: { error: { message: any; }; status: any; }) => {
        this._snackBar.open(
          `Hoppá, nem sikerült lekérni az adatokat! \n ${err.error.message}\nKód: ${err.status}`,
          'OK',
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );
        console.error(err);
      },
      complete: () => {
        // this._snackBar.open(`Sikeres`, 'OK', { duration: 2000, panelClass: ['snackbar-ok'] });
        // console.log('poultry at getAllPoultry', this.poultry);    // debug
      }
    })
    // console.log('PoultryData at ViewInit: ', this.poultry);    // debug
  }

  drop(event: CdkDragDrop<PoultryOfBarton[]>) {

    // console.log('event at drop: ', event);    // debug
    // console.log('lists at drop event: ', this.poultry, this.barton);    // debug
    // console.log(    // debug
    //   'drop data at drop event: \n',
    //   'prevContainer: ', event.previousContainer, '\n',
    //   'container: ', event.container, '\n',
    //   'prevContainer.data: ', event.previousContainer.data, '\n',
    //   'container.data: ', event.container.data, '\n',
    //   'prevIndex: ', event.previousIndex, '\n',
    //   'currentIndex: ', event.currentIndex
    // );

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        // copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.poultry = JSON.parse(JSON.stringify(this.poultryRef));

    console.log('barton at drop: ', this.barton);   // debug
    console.log('poultry at drop: ', this.poultry);   // debug
  }

  // openMenu(i: number, item?: any) {   // debug item

  //   console.log('barton: ', this.barton, i); // debug
  //   console.log('item at openMenu: ', item); // debug

  // }

  logger(event: any) {    // debug
    console.log('logger: ', event);
  }

}

export class PoultryData {

  constructor(
    private poultryHttp: PoultryHttpService,
  ) { }

  getAllPoultry(): Observable<Poultry[]> {
    return this.poultryHttp.getAllPoultry();
  }
}