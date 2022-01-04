import { Component, OnInit, ViewChild, Inject, OnDestroy, AfterViewInit, AfterViewChecked, ChangeDetectorRef, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PoultryOfBarton } from 'src/app/models/poultry-of-barton.model';
import { Poultry } from 'src/app/models/poultry.model';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoultryHttpService } from 'src/app/services/poultry-http.service';
import { ProgressService } from 'src/app/services/progress.service';
import { BartonHttpService } from 'src/app/services/barton-http.service';
import { Barton } from 'src/app/models/barton.model';
import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { AuthService } from 'src/app/services/auth.service';
import { BartonService } from 'src/app/services/barton.service';

@Component({
  selector: 'app-barton',
  templateUrl: './barton.component.html',
  styleUrls: ['./barton.component.scss'],

})

export class BartonComponent implements AfterViewInit {

  // isLoading: boolean = true;

  URL = environment.apiUrl;

  tabIndex: number = 0;
  isTabNameEditing: boolean = true;

  userObject!: UserLoggedIn | null;
  userSignInSubscription?: Subscription;


  // poultryDB!: PoultryData | null;
  bartonsData: Barton[] = [
    {
      _id: '',
      bartonName: 'Udvar 1',
      users: [
        {
          user: this.userObject?._id || '',
          role: 'owner'
        }
      ],
      poultry: []
    }
  ];
  // bartonRef!: PoultryOfBarton[];
  poultryRef!: Poultry[];
  // barton: PoultryOfBarton[] = [];
  poultry: PoultryOfBarton[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private bartonService: BartonService,
    private poultryHttp: PoultryHttpService,
    private _snackBar: MatSnackBar,
    public progress: ProgressService,
  ) { }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  ngOnInit(): void {
    this.progress.isLoading = true;
  }

  ngOnDestroy(): void {
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.bartonsData[0].poultry = [];   // debug
    this.getUserObject();
    this.getPoultryData();
    // this.getBartonsData();
    console.log('UserObject at barton component: ', this.userObject);   // debug
  }

  // getUserObject(): void {
  //   this.userObject = this.authService.getUserLoggedInObj();
  //   console.log('userObject at getUserObject: ', this.userObject);   // debug
  // }

  getUserObject(): void {
    this.userSignInSubscription = this.authService.getUserLoggedInObj().subscribe({
      next: (user) => {
        this.userObject = user;
        // this.isLoggedIn = Boolean(this.userObject);
        console.log('userObject at barton: ', this.userObject)  // debug

        if (this.userObject) {
          this.getBartonsData(this.userObject._id);
        }
      },
      error: (err) => { console.error(err) }
    })
  }

  // getPoultryData() {
  //   this.progress.isLoading = true;
  // }
  // this.poultryDB = new PoultryData(this.poultryHttp);
  // this.poultryDB.getPoultryData().subscribe({
  getPoultryData(): void {

    this.progress.isLoading = true;

    this.poultryHttp.getAllPoultry().subscribe({
      next: (data: Poultry[]) => {
        console.log('getAllPoultry data: ', data);    // debug
        this.poultryRef = [...data];
        // for (const item of this.poultryRef) {
        //   item.quantity = 1;
        // }
        this.poultryRef.forEach(item => item.quantity = 1);
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
        this.progress.isLoading = false;
        // this._snackBar.open(`Sikeres`, 'OK', { duration: 2000, panelClass: ['snackbar-ok'] });
        // console.log('poultry at getAllPoultry', this.poultry);    // debug
      }
    })
    // console.log('PoultryData at ViewInit: ', this.poultry);    // debug}
  }

  getBartonsData(id: string): void {

    this.progress.isLoading = true;
    console.log('getBartonsData called', this.userObject); // debug

    this.bartonService.getBartonsData(id).subscribe({
      next: (data: Barton[]) => {
        console.log('BartonsData: ', this.bartonsData);   // debug
        console.log('getBartonsData: ', data, data.length);    // debug
        if (data.length !== 0) {
          this.bartonsData = [...data];
          // this.bartonRef = this.bartonsData[0].poultry;   // tabIndex!!!
          // this.barton = JSON.parse(JSON.stringify([...this.bartonRef]));
        }
      },
      error: (err: { error: { message: any; }; status: any; }) => {
        this._snackBar.open(
          `Hoppá, nem sikerült lekérni az udvar adatait! \n ${err.error.message}\nKód: ${err.status}`,
          'OK',
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );
        console.error(err);
      },
      complete: () => {
        this.progress.isLoading = false;
      }
    })
    console.log('BartonData at ViewInit: ', this.bartonsData);    // debug}
  }


  drop(event: CdkDragDrop<PoultryOfBarton[]>): void {

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
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.poultry = JSON.parse(JSON.stringify(this.poultryRef));

    console.log('barton at drop: ', this.bartonsData);   // debug
    console.log('poultry at drop: ', this.poultry);   // debug
  }

  addNewBarton(): void {
    const newBarton: Barton = {
      _id: '',
      bartonName: 'Udvar ' + (this.bartonsData.length + 1),
      users: [
        {
          user: this.userObject?._id || '',
          role: 'owner'
        }
      ],
      poultry: []
    }
    this.bartonsData.push(newBarton);
    this.tabIndex = this.bartonsData.length - 1;
  }

  deleteBarton(index: number): void {
    console.log('tabIndex at deleteTab: ', index); // debug
    this.bartonsData.splice(index, 1);
  }

  // saveQty(index: number, value: number): void {
  //   this.barton[index].quantity = value;
  //   console.log('saveQty: ', index, value);   //debug
  //   console.log('saveQty: ', this.barton);   //debug
  // }

  // savecustomName(index: number, value: string | undefined): void {
  //   this.barton[index].customName = value;
  //   console.log('saveCustomName: ', index, value);   //debug
  //   console.log('saveCustomName: ', this.barton);   //debug
  // }

  // openMenu(i: number, item?: any) {   // debug item

  //   console.log('barton: ', this.barton, i); // debug
  //   console.log('item at openMenu: ', item); // debug

  // }

  logger(event: any): void {    // debug
    console.log('logger: ', event);
  }

}

// export class PoultryData {

//   constructor(
//     private poultryHttp: PoultryHttpService,
//   ) { }

//   getAllPoultry(): Observable<Poultry[]> {
//     return this.poultryHttp.getAllPoultry();
//   }
// }