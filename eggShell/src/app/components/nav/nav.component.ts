import { Component, OnInit, Output } from '@angular/core';
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

export interface DialogData {
  tabIndex: 0;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})


export class NavComponent implements OnInit {

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

  isLoggedIn: boolean = false;
  badgeCounter = {
    settings: 1
  }

  // dialogResult!: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    public progress: ProgressService,
  ) { }

  ngOnInit(): void {

    this.checkRefreshToken();
    this.getUserObject();

  }

  ngOnDestroy(): void {

    if (this.userLogoutSubscription) this.userLogoutSubscription.unsubscribe();
    if (this.userRefreshSubscription) this.userRefreshSubscription.unsubscribe();
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();

  }

  checkRefreshToken(): void {
    if (localStorage.getItem('refreshToken')) {
      this.userRefreshSubscription = this.authService.refreshUserAuthentication().subscribe({
        next: () => { },
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
    this.userSignInSubscription = this.authService.getUserLoggedInObj().subscribe({
      next: (user) => {
        this.userObject = user;
        this.isLoggedIn = Boolean(this.userObject);
        console.log('userObject at nav: ', this.userObject, this.isLoggedIn)  // debug
      },
      error: (err) => { console.error(err) },
      complete: () => { }
    })
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(AuthComponent, {
      data: {
        tabIndex: 0
      }
    });

    dialogRef.afterClosed().subscribe({ 
      next: (result) => console.log('loginDialog result: ', result),
    });
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
        this.router.navigate([''])
      },
      error: (err) => { console.error(err) },
      complete: () => { }
    })
  }

}
