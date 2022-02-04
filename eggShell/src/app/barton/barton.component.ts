import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { PoultryOfBarton } from 'src/app/barton/models/poultry-of-barton.model';
import { Poultry } from 'src/app/barton/models/poultry.model';
import { map, Observable, shareReplay, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoultryHttpService } from 'src/app/barton/services/poultry-http.service';
import { ProgressService } from 'src/app/common/services/progress.service';
import { Barton } from 'src/app/barton/models/barton.model';
// import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BartonService } from 'src/app/barton/services/barton.service';
import { BartonHttpService } from 'src/app/barton/services/barton-http.service';
import { UserLoggedIn } from 'src/app/common/models/user.model';
import { ConfirmPopupComponent } from '../common/confirm-popup/confirm-popup.component';


@Component({
  selector: 'app-barton',
  templateUrl: './barton.component.html',
  styleUrls: ['./barton.component.scss'],

})

export class BartonComponent implements AfterViewInit, OnInit, OnDestroy {

  @Input() editAllowed?: boolean = false;

  URL = environment.apiUrl;

  userObject$: Observable<UserLoggedIn | null> = this.authService.getUserLoggedInObj();
  userId: string | undefined = this.authService.getUserAuthData()?._id;
  userSignInSubscription?: Subscription;
  // bartonsDataSubscription: Subscription = this.bartonService.getBartonList().subscribe();
  // userHasBarton: boolean = false;

  // bartonsData$: Barton[] = [];
  bartonsData$: Observable<Barton[]> = this.bartonService.getBartonList();

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
    // this.progress.isLoading = true;
    // this.getBartonList();
  }

  ngOnDestroy(): void {
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();
    // if (this.bartonsDataSubscription) this.bartonsDataSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // this.getUserObject();
    // this.getBartonList();
    // if (this.userObject) { this.getBartonsData(this.userObject?._id) };
    if (this.userId) { this.getBartonsData(this.userId) };
    this.getPoultryData();
    console.log('UserObject at barton component: ', this.userObject$);   // debug
    console.log('BartonsData at barton component: ', this.bartonsData$);   // debug
  }

  // getUserObject(): void {
  //   this.userSignInSubscription = this.authService.getUserLoggedInObj()
  //     .subscribe({
  //       next: (user) => {
  //         // this.userObject$ = user;
  //         // this.isLoggedIn = Boolean(this.userObject);
  //         this.userHasBarton = !!(this.userObject$?.bartons?.length);
  //         console.log('userObject at barton: ', this.userObject$)  // debug
  //       },
  //       error: (err) => { console.error(err) }
  //     })
  // }

  getBartonsData(id: string): void {

    this.progress.isLoading = true;

    console.log('getBartonsData called', id); // debug

    this.bartonService.getBartonsData(id)
      .subscribe({
        next: (data: Barton[]) => {
          // this.bartonsData = data;
          // this.hasBarton = !!(data.length);
          // this.navigate('getBartonsData');
          // console.log('hasBarton: ', this.hasBarton);   // debug
        },
        error: (err: { error: { message: any; }; status: any; }) => {
          this._snackBar.open(
            `Hoppá, nem sikerült lekérni az udvarok adatait! \n ${err.error.message}\nKód: ${err.status}`,
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
  }

  // getBartonList(): void {
  //   this.bartonsDataSubscription = this.bartonService.getBartonList()
  //     .subscribe({
  //       next: (data: Barton[]) => {
  //         this.bartonsData = data;
  //         console.log('bartonsData at barton`s subscribtion: ', this.bartonsData)  // debug
  //         console.log('%cBartonList asObservable:', 'color: yellow', this.bartonService.getBartonList());     // debug
  //       }
  //     })
  // }

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

    console.log('bartonsData at drop: ', this.bartonsData$);   //debug

    this.bartonService.saveBartonData();
    // this.saveBarton(this.bartonsData$);
  }

  addNewBarton(index?: number): void {
    const newBarton: Barton = {
      _id: '',
      bartonName: 'Udvar ' + (this.bartonService.getBartonListValue().length + 1),
      users: [
        {
          user: this.userId || '',
          role: 'owner'
        }
      ],
      poultry: []
    }
    // this.bartonsData.splice(index + 1, 0, newBarton);
    this.bartonService.saveBartonData([newBarton]);
  }

  deleteBarton(barton: Barton): void {

    let deleteConfirm: boolean = false;

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        actionConfirm: deleteConfirm,
        message: 'Biztosan törölni akarod?',
        actionButtonLabel: 'Töröl'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      deleteConfirm = result || false;
      console.log('%cDeleteDialogData: ', 'color:red', deleteConfirm);     // debug
      if (deleteConfirm) {
        this.bartonService.deleteBarton(barton);
      }
    });

  }

  saveBarton(barton: Barton): void {
    this.bartonService.saveBartonData([barton]);
  }

  isOwner(barton: Barton): boolean {
    if (this.userId) {
      for (const user of barton.users) {
        if (user.user === this.userId && user.role === 'owner') {
          return true;
        }
      }
    }
    return false;
  }

  // logger(event?: any): void {    // debug
  //   console.log('logger: ', event);
  //   console.log('logger: ', this.bartonsData);
  //   console.log('logger: ', this.bartonService.getBartonListValue());
  //   this.bartonService.setBartonList(this.bartonsData);
  // }

  allowMove() {
    return true;
  }

  denyMove() {    //debug
    return false;
  }



}