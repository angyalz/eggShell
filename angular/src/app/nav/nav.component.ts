import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProgressService } from 'src/app/common/services/progress.service';
import { environment } from 'src/environments/environment';
import { AuthComponent } from '../auth/auth.component';
import { User, UserLoggedIn } from 'src/app/common/models/user.model';
import { NotificationService } from './services/notification.service';
import { Notice } from './models/notification.model';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../common/services/user.service';

export interface DialogData {
  tabIndex: 0
}

export interface SnackbarData {
  username: string,
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

  isHandset!: boolean; 
  isHandsetSubscription: Subscription = this.isHandset$.subscribe(res => this.isHandset = res);

  URL = environment.apiUrl;

  userObject!: UserLoggedIn | null;
  userObject$: Observable<UserLoggedIn | null> = this.authService.getUserLoggedInObj();
  // userData$: Observable<User | null> = this.userService.getUserData();
  userSignInSubscription?: Subscription = this.userObject$.subscribe(user => this.userObject = user);
  userLogoutSubscription?: Subscription;
  userRefreshSubscription?: Subscription;

  isLoggedIn: boolean = false;
  hasBarton: boolean = false;

  notificationCounter$: Observable<number> = this.notification.getNotificationCounter();
  notificationSubject$: Observable<Notice[]> = this.notification.getNotificationSubject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private notification: NotificationService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    public progress: ProgressService,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
  ) { }

  ngAfterViewInit(): void {
    // this.navigate();
    // this.isHandsetSubscription = this.isHandset$.subscribe(res => this.isHandset = res);
  }

  ngOnInit(): void {
    this.checkRefreshToken();
    this.getUserObject();
  }

  ngOnDestroy(): void {
    if (this.userLogoutSubscription) this.userLogoutSubscription.unsubscribe();
    if (this.userRefreshSubscription) this.userRefreshSubscription.unsubscribe();
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();
    if (this.isHandsetSubscription) this.isHandsetSubscription.unsubscribe();
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
    }
  }

  getUserObject(): void {
    this.userSignInSubscription = this.userObject$.subscribe({
        next: (user) => {
          this.userObject = user;
          this.isLoggedIn = Boolean(this.userObject);
          this.hasBarton = !!user?.bartons.length;
          if (user) {
            this.navigate('hasToken');
          } else {
            this.navigate('hasn`t token')
          }

          console.log('%cuserObject at nav: ', 'color:lightgreen', this.userObject, this.isLoggedIn, this.hasBarton)  // debug
        },
        error: (err) => { console.error(err) }
      })
  }

  navigate(from?: string): void {
    console.log('%cnavigate starts from', 'color:orange', from)    // debug
    console.log('%c', 'color:orange', this.isLoggedIn, this.hasBarton)    // debug
    if ((this.isLoggedIn) && (this.hasBarton)) {
      this.router.navigate(['/main'])
    } else {
      this.router.navigate(['/getting-started'])
    }
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(AuthComponent, {
      data: {
        tabIndex: 0
      }
    });

    // dialogRef.afterClosed().subscribe(result => { });
  }

  openRegDialog(): void {
    const dialogRef = this.dialog.open(AuthComponent, {
      data: {
        tabIndex: 1
      }
    });

    // dialogRef.afterClosed().subscribe(result => { });
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

  menuClick(drawer: MatSidenav): any {
    if (this.isHandset) return drawer.toggle();
  }
}
