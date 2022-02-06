import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Observable, map, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProgressService } from 'src/app/common/services/progress.service';
import { UserHttpService } from 'src/app/common/services/user-http.service';
import { AuthComponent } from 'src/app/auth/auth.component';
import { requestEmailMatchValidator } from 'src/app/common/validators/request-email-match.validator';
import { BartonComponent } from 'src/app/barton/barton.component';
import { BartonService } from 'src/app/barton/services/barton.service';
import { Router } from '@angular/router';
import { Barton } from 'src/app/barton/models/barton.model';
import { UserLoggedIn } from 'src/app/common/models/user.model';
import { RequestHttpService } from '../nav/services/request-http.service';

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

  @Input() bartonsData: Barton[] | [] = [];

  userObject!: UserLoggedIn | null;
  userObject$: Observable<UserLoggedIn | null> = this.authService.getUserLoggedInObj();
  isLoggedIn!: boolean;
  isEmailValid: boolean | null = null;

  userSignInSubscription?: Subscription = this.userObject$.subscribe(user => this.userObject = user);

  stepperOrientation: Observable<StepperOrientation>;
  stepperIndex: number = 0;
  tabIndex: number = 0;
  counter!: number;

  dialogRef!: MatDialogRef<AuthComponent, any>;

  emailPattern: string | RegExp = '^[a-zA_Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$';
  requestId!: string;
  requestEmailFormControl = new FormControl('',
    [
      Validators.required,
      Validators.email,
      Validators.pattern(this.emailPattern),
      // requestEmailMatchValidator(this.userObject.email),
    ]
  );

  @ViewChild('stepper') private stepper!: MatStepper;
  // @ViewChild('barton') private bartonComponent!: BartonComponent;

  constructor(
    private authService: AuthService,
    private bartonService: BartonService,
    private progress: ProgressService,
    private userHttpService: UserHttpService,
    private requestHttpService: RequestHttpService,
    breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 40em)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.userSignInSubscription) this.userSignInSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.getUserObject();
  }

  getUserObject(): void {
    this.userSignInSubscription = this.userObject$.subscribe({
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

  setStepper(): void {
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

    // this.dialogRef.afterClosed().subscribe(result => { });
  }

  openRegDialog(): void {
    this.dialogRef = this.dialog.open(AuthComponent, {
      data: {
        tabIndex: 1
      }
    });

    // this.dialogRef.afterClosed().subscribe(result => { });
  }

  sendInvite(): void {

    this.progress.isLoading = true;

    if (this.userObject) {
      this.requestHttpService.sendConnectionRequest(this.userObject?._id, this.requestId)
        .subscribe({
          next: () => { },
          error: (err) => {
            console.error(err);
            this._snackBar.open(
              `Hoppá, nem sikerült elküldeni a csatlakozási kérelmet...`,
              'OK',
              {
                verticalPosition: 'top',
                panelClass: ['snackbar-error']
              }
            );
          },
          complete: () => {
            this.progress.isLoading = false;
            this.stepper.next();
          }
        })
    }
  }

  checkEmailIsValid(email: string): void {

    console.log('email check form invalid: ', this.requestEmailFormControl.invalid);   // debug

    if (email.toLowerCase() == this.userObject?.email.toLowerCase()) {
      this._snackBar.open(
        `Magadnak nem küldhetsz kérést!`,
        'OK',
        {
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        }
      );
      this.isEmailValid = false;

    } else if (!this.requestEmailFormControl.invalid) {

      this.progress.isLoading = true;
      console.log('email check begins');    //debug
      setTimeout(() => {
        this.userHttpService.checkUserByEmail(email)
          .subscribe({
            next: (data) => {
              if (data[0]?._id !== undefined) {
                console.log('data at checkEmailIsValid: ', data);    // debug 
                this.isEmailValid = true;
                this.requestId = data[0]._id;
              } else {
                this.isEmailValid = false;
                console.log('data at checkEmailIsValid: ', data);    // debug 
              }

              if (!data) {
                this._snackBar.open(
                  `A keresett felhasználó még nem rendelkezik fiókkal`,
                  'OK',
                  {
                    duration: 10000,
                    verticalPosition: 'top',
                    panelClass: ['snackbar-info']
                  }
                );
              }
              console.log('isEmailValid: ', this.isEmailValid); // debug
            },
            error: (err) => {
              this._snackBar.open(
                `Hoppá, nem sikerült ellenőrizni az e-mail címet! \n ${err.error.message}\nKód: ${err.status}`,
                'OK',
                {
                  duration: 5000,
                  panelClass: ['snackbar-error']
                }
              );
              console.error(err);
            },
            complete: () => { this.progress.isLoading = false }
          })
      }, 1000);
    }
  }

  saveBarton(): void {
    this.bartonService.setBartonList(this.bartonService.getBartonListValue());
  }

  getStepperIndex(index: any): void {
    console.log('%cselected index changed', 'color: green', index)    // debug
    if (index.selectedIndex === 2) {
      this.stepperCompleted();
    }
  }

  stepperCompleted(): void {
    setTimeout(() => {
      console.log('navigate to main');    // debug
      this.router.navigate(['/main'])
    }, 5000);
  }

}
