import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';

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

  userObject: any;
  userSignInSubscription?: Subscription;
  userLogoutSubscription?: Subscription;
  userRefreshSubscription?: Subscription;

  isLoggedIn: boolean = false;
  badgeCounter = {
    settings: 1
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    if (localStorage.getItem('refreshToken')) {
      this.userRefreshSubscription = this.authService.refreshUserAuthentication().subscribe(
        () => { },
        (err) => {
          this._snackBar.open(`A munkamenet lejárt, lépj be újra!`, 'OK', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
          this.openLoginDialog();
        }
      )
    }

    this.userSignInSubscription = this.authService.getUserLoggedInObj().subscribe({
      next: (user) => {
        this.userObject = user;
        this.isLoggedIn = Boolean(this.userObject);
        console.log('userObject at nav: ', this.userObject, this.isLoggedIn)  // debug
      },
      error: (err) => { },
      complete: () => { }
    })
  }

  ngOnDestroy(): void {

    if (this.userLogoutSubscription) this.userLogoutSubscription.unsubscribe();
    if (this.userRefreshSubscription) this.userRefreshSubscription.unsubscribe();
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();

  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {});

    dialogRef.afterClosed().subscribe(result => { });
  }

  openRegDialog(): void {
    const dialogRef = this.dialog.open(RegistrationComponent, {});

    dialogRef.afterClosed().subscribe(result => { });
  }

  logout() {
    this.userLogoutSubscription = this.authService.logout().subscribe({
      next: () => { },
      error: (err) => { err },
      complete: () => {
        this._snackBar.open(`Sikeres kilépés`, 'OK', {
          duration: 2000,
          panelClass: ['snackbar-ok']
        });
        this.router.navigate([''])
      }
    })
  }

}
