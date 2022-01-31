import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoginComponent } from '../auth/login/login.component';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProgressService } from 'src/app/common/services/progress.service';
// import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { environment } from 'src/environments/environment';
import { AuthComponent } from '../auth/auth.component';
import { BartonService } from 'src/app/barton/services/barton.service';
import { Barton } from 'src/app/barton/models/barton.model';
import { GettingStartedComponent } from '../getting-started/getting-started.component';
import { User, UserLoggedIn } from 'src/app/common/models/user.model';
import { UserHttpService } from 'src/app/common/services/user-http.service';

export interface DialogData {
  tabIndex: 0;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})


export class NavComponent implements AfterViewInit, OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  URL = environment.apiUrl;

  userObject!: UserLoggedIn | null;
  userData!: User;
  userSignInSubscription?: Subscription;
  userLogoutSubscription?: Subscription;
  userRefreshSubscription?: Subscription;
  getBartonsDataSubscription?: Subscription;
  // bartonsData: Barton[] | [] = [];

  isLoggedIn: boolean = false;
  // hasBarton: boolean = false;
  hasBarton: boolean = false;

  badgeCounter = {
    settings: {
      pendingRequests: this.userData?.pendingRequests?.length ?? 0,
    },
    getSumOfSettings(): number {
      let sum = 0;
      let elem: keyof typeof this.settings;
      for (elem in this.settings) {
        sum += this.settings[elem];
      }
      return sum;
    }
  }


  // dialogResult!: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private bartonService: BartonService,
    private userHttpService: UserHttpService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    public progress: ProgressService,
  ) { }

  ngAfterViewInit(): void {
    // this.navigate();
  }

  ngOnInit(): void {

    this.checkRefreshToken();
    this.getUserObject();
  }

  ngOnDestroy(): void {

    if (this.userLogoutSubscription) this.userLogoutSubscription.unsubscribe();
    if (this.userRefreshSubscription) this.userRefreshSubscription.unsubscribe();
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();
    if (this.getBartonsDataSubscription) this.getBartonsDataSubscription.unsubscribe();
  }

  checkRefreshToken(): void {
    if (localStorage.getItem('refreshToken')) {
      this.userRefreshSubscription = this.authService.refreshUserAuthentication().subscribe({
        next: (user: UserLoggedIn) => {
          console.log('%ccheckRefreshToken done', 'color: yellow;', user)    // debug
          this.navigate('hasToken');
        },
        error: (err) => {
          this._snackBar.open(`A munkamenet lejárt, lépj be újra!`, 'OK', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
          this.openLoginDialog();
        },
        complete: () => { }
      })
    } else {
      this.navigate('hasn`t token');
    }
    // console.log('token checked at nav');    // debug
  }

  getUserObject(): void {
    this.userSignInSubscription = this.authService.getUserLoggedInObj()
      .subscribe({
        next: (user) => {
          this.userObject = user;
          this.isLoggedIn = Boolean(this.userObject);
          this.hasBarton = !!user?.bartons.length;

          if (this.userObject) {
            this.getUserData(this.userObject._id);
          };

          this.navigate('hasToken');
          // if (this.userObject?.pendingRequests !== undefined) {
          //   this.badgeCounter.pendingRequests = user?.pendingRequests?.length
          // };

          // if (this.userObject) { this.getBartonsData(this.userObject?._id) }

          console.log('userObject at nav: ', this.userObject, this.isLoggedIn)  // debug
        },
        error: (err) => { console.error(err) }
      })
    // console.log('getUserObject method ended at nav', this.userObject);     // debug
  }

  getUserData(userId: string): void {
    this.userHttpService.getById(userId).subscribe({
      next: (user) => {
        this.userData = user;
        this.badgeCounter.settings.pendingRequests = this.userData?.pendingRequests?.length ?? 0;

        if (this.userData.pendingRequests?.length) {
          this.newRequest(this.userData.pendingRequests);


          // const snackBarRef = this._snackBar.open('')
          // snackBarRef.afterDismissed().subscribe({
          // next: () => {}
          // })
        }
        console.log('%cuserData at nav: ', 'color:cyan', this.userData);     // debug
        console.log('%cbadgeCounter.pendingRequests at nav: ', 'color:orange', this.badgeCounter.settings.pendingRequests);     // debug
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => { }
    })
  }

  newRequest(requestUser: User["pendingRequests"]): void {

    if (requestUser) {
      for (let elem of requestUser) {
        const snackBarRef = this._snackBar.open(`${elem.username}`, 'OK')
        snackBarRef.afterDismissed().subscribe({
          next: () => { console.log('%cAction!!!', 'color: orange')}
        })
      }
    }
  }

  // getBartonsData(id: string): void {

  //   this.progress.isLoading = true;

  //   console.log('getBartonsData called', id); // debug

  //   this.getBartonsDataSubscription = this.bartonService.getBartonsData(id)
  //     .subscribe({
  //       next: (data: Barton[]) => { 
  //         this.bartonsData = data;
  //         // this.hasBarton = !!(data.length);
  //         this.navigate('getBartonsData');
  //         console.log('hasBarton: ', this.hasBarton);   // debug
  //       },
  //       error: (err: { error: { message: any; }; status: any; }) => {
  //         this._snackBar.open(
  //           `Hoppá, nem sikerült lekérni az udvarok adatait! \n ${err.error.message}\nKód: ${err.status}`,
  //           'OK',
  //           {
  //             duration: 5000,
  //             panelClass: ['snackbar-error']
  //           }
  //         );
  //         console.error(err);
  //       },
  //       complete: () => {
  //         this.progress.isLoading = false;
  //       }
  //     })
  // }

  navigate(from?: string): void {
    console.log('%cnavigate starts from', 'color:orange', from)    // debug
    console.log('%c', 'color:orange', this.isLoggedIn, this.hasBarton)    // debug
    if ((!this.isLoggedIn) && (!this.hasBarton)) {
      this.router.navigate(['/getting-started'])
    } else {
      this.router.navigate(['/main'])
    }
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(AuthComponent, {
      data: {
        tabIndex: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  openRegDialog(): void {
    const dialogRef = this.dialog.open(AuthComponent, {
      data: {
        tabIndex: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  logout(): void {
    this.userLogoutSubscription = this.authService.logout().subscribe({
      next: () => {
        this._snackBar.open(`Sikeres kilépés`, 'OK', {
          duration: 2000,
          panelClass: ['snackbar-ok']
        });
        this.router.navigate(['/getting-started'])
      },
      error: (err) => { console.error(err) },
      complete: () => { }
    })
  }

  menuClick(): void {
    console.log(this.isHandset$);   // debug
  }

  menuBadgeCounter(): number {

    return this.badgeCounter.getSumOfSettings();

    // let sum = 0;
    // let elem: keyof typeof this.badgeCounter;

    // for (elem in this.badgeCounter) {
    //   console.log('elem type: ', elem, typeof (elem), typeof (this.badgeCounter[elem]))
    //   if (typeof(this.badgeCounter[elem]) === 'number') {
    //     // sum += this.badgeCounter[elem] ?? 0;
    //   };
    // }

    // return sum;
  };


}
