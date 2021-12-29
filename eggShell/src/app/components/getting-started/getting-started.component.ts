import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, Subscription } from 'rxjs';
import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { AuthService } from 'src/app/services/auth.service';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {

  stepperOrientation: Observable<StepperOrientation>;
  stepperIndex: number = 0;
  tabIndex: number = 0;

  userObject!: UserLoggedIn | null;
  isLoggedIn!: boolean;
  userSignInSubscription!: Subscription;

  inviteEmail!: string;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    breakpointObserver: BreakpointObserver
    ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 40em)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.getUserObject();
  }

  getUserObject(): void {
    this.userSignInSubscription = this.authService.userLoggedInObject.subscribe({
      next: (user) => {
        this.userObject = user;
        this.isLoggedIn = Boolean(this.userObject);
        if (this.isLoggedIn) {
          this.stepperIndex = 1;
        } else {
          this.stepperIndex = 0;
        }
        console.log('isLoggedIn at getting-started: ', this.isLoggedIn);  // debug
        console.log('stepperIndex at getting-started: ', this.stepperIndex);  // debug
      },
      error: (err) => { console.error(err) }
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
}
