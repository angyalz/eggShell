import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Observable, map, Subscription } from 'rxjs';
import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressService } from 'src/app/services/progress.service';
import { UserHttpService } from 'src/app/services/user-http.service';
import { AuthComponent } from '../auth/auth.component';
import { requestEmailMatchValidator } from 'src/app/validators/request-email-match.validator';
import { BartonComponent } from '../barton/barton.component';
import { BartonService } from 'src/app/services/barton.service';
import { Router } from '@angular/router';
import { Barton } from 'src/app/models/barton.model';

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
  isLoggedIn!: boolean;
  isEmailValid: boolean | null = null;

  userSignInSubscription!: Subscription;

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
  @ViewChild('barton') private bartonComponent!: BartonComponent;

  constructor(
    private authService: AuthService,
    private bartonService: BartonService,
    private progress: ProgressService,
    private userHttpService: UserHttpService,
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

  sendInvite(): void {

    this.progress.isLoading = true;

    if (this.userObject) {
      this.userHttpService.sendConnectionRequest(this.userObject?._id, this.requestId)
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
