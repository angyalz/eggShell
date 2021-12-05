import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PoultryDialogComponent } from './poultry-dialog/poultry-dialog.component';
import { PoultryOfBarton } from 'src/app/models/poultry-of-barton.model';
import { Poultry } from 'src/app/models/poultry.model';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  qty: number;
  name: string;
}

@Component({
  selector: 'app-barton',
  templateUrl: './barton.component.html',
  styleUrls: ['./barton.component.scss']
})
export class BartonComponent implements OnInit, OnDestroy {

  isOpen: boolean = false;
  selectedItem: any;

  URL = environment.apiUrl;
  poultrySubscription: Subscription = new Subscription;


  barton: Array<PoultryOfBarton> = [];
  poultryRef: Array<PoultryOfBarton> = [
    // {
    //   species: 'tyúk',
    //   image: `${this.URL}images/poultries/hen.png`,
    //   qty: 6,
    //   isOpen: false,
    // },
    // {
    //   species: 'kakas',
    //   image: `${this.URL}images/poultries/rooster2.png`,
    //   qty: 1,
    //   isOpen: false,
    // },
    // {
    //   species: 'kacsa',
    //   image: `${this.URL}images/poultries/duck2.png`,
    //   qty: 2,
    //   isOpen: false,
    // },
    // {
    //   species: 'gácsér',
    //   image: `${this.URL}images/poultries/duck1.png`,
    //   qty: 1,
    //   isOpen: false,
    // }
  ];
  // poultry = this.poultryRef.map(obj => ({...obj}));
  poultry = JSON.parse(JSON.stringify(this.poultryRef));
  // poultryToMove = [...this.poultry];
  
  constructor(
    public dialog: MatDialog,
    private http: BaseHttpService<PoultryOfBarton>,
    private _snackBar: MatSnackBar,
  ) { 

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }
  
  // this.barton = [...this.barton, this.isOpen];

  drop(event: CdkDragDrop<PoultryOfBarton[]>) {
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
    // this.barton[event.currentIndex].quantity = this.barton[event.currentIndex].quantity + event.currentIndex; // debug 
    // this.poultry = this.poultryRef.map(obj => ({ ...obj }));
    this.poultry = JSON.parse(JSON.stringify(this.poultryRef));
    console.log('event at drop: ', event);
    console.log('barton at drop: ', this.barton);
    console.log('poultry at drop: ', this.poultry);
  }

  // regNewUser(user: any): Observable<User> {
  //   return this.http.post<User>(`${this.BASE_URL}register`, user);
  // }

  getAllPoultry() {
    this.poultrySubscription = this.http.getAll()
    .subscribe({
      next: (data) => { this.poultryRef = data},
      error: (err) => {
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
        this._snackBar.open(`Sikeres`, 'OK', { duration: 2000, panelClass: ['snackbar-ok'] });
        // this.router.navigate(['/']);
      }
    })
  }

  // openDialog(item: any, i: number): void {
  //   const dialogRef = this.dialog.open(PoultryDialogComponent, {
  //     // width: '250px',
  //     data: { qty: item.qty, name: item.customName },
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     // console.log('The dialog was closed');
  //     console.log('DialogResult: ', result);
  //     this.barton[i].qty = result.qty;
  //     this.barton[i].customName = result.name;
  //     console.log('barton array: ', this.barton, '\nindex: ', i);
  //   });
  // }

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

  logger(event: any) {
    console.log('logger: ', event);
  }

}
