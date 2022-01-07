import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PoultryOfBarton } from 'src/app/models/poultry-of-barton.model';
import { Poultry } from 'src/app/models/poultry.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoultryHttpService } from 'src/app/services/poultry-http.service';
import { ProgressService } from 'src/app/services/progress.service';
import { Barton } from 'src/app/models/barton.model';
import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { AuthService } from 'src/app/services/auth.service';
import { BartonService } from 'src/app/services/barton.service';
import { BartonHttpService } from 'src/app/services/barton-http.service';

@Component({
  selector: 'app-barton',
  templateUrl: './barton.component.html',
  styleUrls: ['./barton.component.scss'],

})

export class BartonComponent implements AfterViewInit, OnInit, OnDestroy {

  URL = environment.apiUrl;

  userObject!: UserLoggedIn | null;
  userSignInSubscription?: Subscription;
  bartonsDataSubscription?: Subscription;
  userHasBarton: boolean = false;

  bartonsData: Barton[] = [
    {
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
  poultryRef!: Poultry[];
  poultry: PoultryOfBarton[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private bartonService: BartonService,
    private bartonHttp: BartonHttpService,
    private poultryHttp: PoultryHttpService,
    private _snackBar: MatSnackBar,
    public progress: ProgressService,
  ) { }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  ngOnInit(): void {
    this.progress.isLoading = true;
    this.getBartonList();
  }

  ngOnDestroy(): void {
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();
    if (this.bartonsDataSubscription) this.bartonsDataSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.getUserObject();
    this.getPoultryData();
    console.log('UserObject at barton component: ', this.userObject);   // debug
    console.log('BartonsData at barton component: ', this.bartonsData);   // debug
  }

  getUserObject(): void {
    this.userSignInSubscription = this.authService.getUserLoggedInObj()
      .subscribe({
        next: (user) => {
          this.userObject = user;
          // this.isLoggedIn = Boolean(this.userObject);
          this.userHasBarton = !!(this.userObject?.bartons?.length);
          console.log('userObject at barton: ', this.userObject)  // debug
        },
        error: (err) => { console.error(err) }
      })
  }

  getBartonList(): void {
    this.bartonsDataSubscription = this.bartonService.getBartonList()
      .subscribe({
        next: (data: Barton[]) => {
          this.bartonsData = data;
          console.log('bartonsData at barton`s subscribtion: ', this.bartonsData)  // debug
        }
      })
  }

  getPoultryData(): void {
    this.progress.isLoading = true;

    this.poultryHttp.getAll()
      .subscribe({
        next: (data: Poultry[]) => {
          // console.log('getAllPoultry data: ', data);    // debug
          this.poultryRef = [...data];
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

  drop(event: CdkDragDrop<PoultryOfBarton[]>): void {

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

    console.log('bartonsData at drop: ', this.bartonsData);   //debug

    this.bartonService.saveBartonData();
  }

  addNewBarton(index: number): void {
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
    this.bartonsData.splice(index + 1, 0, newBarton);
  }

  deleteBarton(index: number): void {
    console.log('tabIndex at deleteTab: ', index); // debug
    this.bartonsData.splice(index, 1);
  }

  isOwner(barton: Barton): boolean {
    if (this.userObject) {
      for (const user of barton.users) {
        if (user.user === this.userObject._id && user.role === 'owner') {
          return false;
        }
      }
    }
    return true;
  }

  logger(event: any): void {    // debug
    console.log('logger: ', event);
    console.log('logger: ', this.bartonsData);
    console.log('logger: ', this.bartonService.getBartonListValue());
  }

}