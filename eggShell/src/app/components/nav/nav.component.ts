import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';
import { ProgressService } from 'src/app/services/progress.service';
import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { environment } from 'src/environments/environment';
import { AuthComponent } from '../auth/auth.component';
import { BartonService } from 'src/app/services/barton.service';
import { Barton } from 'src/app/models/barton.model';
import { GettingStartedComponent } from '../getting-started/getting-started.component';

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
  userSignInSubscription?: Subscription;
  userLogoutSubscription?: Subscription;
  userRefreshSubscription?: Subscription;
  getBartonsDataSubscription?: Subscription;
  bartonsData: Barton[] | [] = [];

  isLoggedIn: boolean = false;
  hasBarton: boolean = false;

  badgeCounter = {
    settings: 1
  }

  // dialogResult!: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private bartonService: BartonService,
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

          if (this.userObject) { this.getBartonsData(this.userObject?._id) }
          
          console.log('userObject at nav: ', this.userObject, this.isLoggedIn)  // debug
        },
        error: (err) => { console.error(err) }
      })
    // console.log('getUserObject method ended at nav', this.userObject);     // debug
  }

  getBartonsData(id: string): void {

    this.progress.isLoading = true;

    console.log('getBartonsData called', id); // debug

    this.getBartonsDataSubscription = this.bartonService.getBartonsData(id)
      .subscribe({
        next: (data: Barton[]) => { 
          this.bartonsData = data;
          this.hasBarton = !!(data.length);
          this.navigate('getBartonsData');
          console.log('hasBarton: ', this.hasBarton);   // debug
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

  navigate(from?: string): void {
    console.log('%cnavigate starts from', 'color:orange', from)    // debug
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

}
