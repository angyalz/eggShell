import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Observable, map, Subscription } from 'rxjs';
import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { AuthService } from 'src/app/services/auth.service';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})

export class GettingStartedComponent implements AfterViewInit, OnInit, OnDestroy {
  
  userObject!: UserLoggedIn | null;
  isLoggedIn!: boolean;

  userSignInSubscription!: Subscription;

  stepperOrientation: Observable<StepperOrientation>;
  stepperIndex: number = 0;
  tabIndex: number = 0;

  dialogRef!: MatDialogRef<AuthComponent, any>;

  emailPattern: string | RegExp = '^\S+@\S{2,}\.\S{2,}$';
  inviteEmailFormControl = new FormControl('',
    [
      Validators.required,
      Validators.email,
      // Validators.pattern(this.emailPattern),
    ]
  );

  @ViewChild('stepper') private stepper!: MatStepper;

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
    // console.log('Getting Started ngOnInit');  // debug
    // console.log('Getting Started isLoggedin: ', this.isLoggedIn);  // debug
    // console.log('Getting Started userObject: ', this.userObject);  // debug
    // this.getUserObject();
  }

  ngOnDestroy(): void {
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // console.log('Getting Started ngAfterViewInit');  // debug
    // console.log('Getting Started isLoggedin: ', this.isLoggedIn);  // debug
    // console.log('Getting Started userObject: ', this.userObject);  // debug
    // console.log('Getting Started stepperOrientation: ', this.stepperOrientation);  // debug
    this.getUserObject();
    // this.setStepper();
  }

  getUserObject(): void {
    this.userSignInSubscription = this.authService.getUserLoggedInObj().subscribe({
      next: (user) => {
        this.userObject = user;
        this.isLoggedIn = Boolean(this.userObject);
        this.setStepper();
        // console.log('isLoggedIn at getting-started: ', this.isLoggedIn);  // debug
        // console.log('stepperIndex at getting-started: ', this.stepperIndex);  // debug
      },
      error: (err) => { console.error(err) }
    })
  }

  setStepper (): void {
    // console.log('SetStepper called');     // debug
    if (this.isLoggedIn) {
      this.stepper.next();
      this.dialogRef.close();
      // console.log('CloseDialog at SetStepper');     // debug
      // console.log('Stepper: ', this.stepper);   // debug
    } else {
      this.stepper.reset();
      this.openLoginDialog();
      // console.log('OpenDialog at SetStepper');     // debug
      // console.log('Stepper: ', this.stepper);   // debug
    }
  }

  openLoginDialog(): void {
    this.dialogRef = this.dialog.open(AuthComponent, {
      data: {
        tabIndex: 0
      }
    });

    this.dialogRef.afterClosed().subscribe(result => { });
  }

  openRegDialog(): void {
    this.dialogRef = this.dialog.open(AuthComponent, {
      data: {
        tabIndex: 1
      }
    });

    this.dialogRef.afterClosed().subscribe(result => { });
  }

  sendInvite(email: any): void {
    console.log('Invite input: ', email);
    this.stepper.next();
  }

  saveBarton(): void {

  }
}
