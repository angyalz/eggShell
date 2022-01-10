import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
import { UserLogin } from 'src/app/models/user-login.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { BartonService } from 'src/app/services/barton.service';
import { ProgressService } from 'src/app/services/progress.service';
import { ValidationErrorHandlerService } from 'src/app/services/validation-error-handler.service';
import { matchValidator } from 'src/app/validators/match.validator';
import { passwordStrengthValidator } from 'src/app/validators/password-strength.validator';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  hide = true;  // pwd visible switch

  loginSubscription: Subscription = new Subscription;
  regSubscription: Subscription = new Subscription;
  getBartonsDataSubscription: Subscription = new Subscription;

  userObject: any;

  lettersOnlyPattern: string | RegExp = '^[a-zA-Z íöüóőúűéáÍÖÜÓŐÚŰÉÁ]+$';
  numbersOnlyPattern: string | RegExp = '^[0-9]+$';
  // emailPattern: string | RegExp = '^\S+@\S{2,}\.\S{2,}$';

  userReg: FormGroup = new FormGroup({

    username: new FormControl('',
      {
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(this.lettersOnlyPattern)
        ],
      }
    ),
    email: new FormControl('',
      {
        validators: [
          Validators.required,
          Validators.email,
          // Validators.pattern(this.emailPattern)
        ],
        updateOn: 'blur'
      }
    ),
    password: new FormControl('',
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          passwordStrengthValidator(),
          matchValidator('password', 'passCheck')
        ]
      }
    ),
    passCheck: new FormControl('',
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          passwordStrengthValidator(),
          matchValidator('password', 'passCheck')
        ]
      }
    ),
  },
    {}
  );

  get username() {
    return this.userReg.controls['username'] as FormControl;
  }

  // get avatarUrl() {
  //   return this.userReg.controls['avatarUrl'] as FormControl;
  // }

  get email() {
    return this.userReg.controls['email'] as FormControl;
  }

  get password() {
    return this.userReg?.controls['password'] as FormControl;
  }

  get passCheck() {
    return this.userReg?.controls['passCheck'] as FormControl;
  }

  constructor(
    private authService: AuthService,
    private validErrorHandler: ValidationErrorHandlerService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private _snackBar: MatSnackBar,
    private bartonService: BartonService,
    private progress: ProgressService
  ) { }

  ngOnInit(): void {
    // console.log(this.userReg);  // debug
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
    if (this.regSubscription) this.regSubscription.unsubscribe();
  }

  regUser(user: User) {

    this.progress.isLoading = true;

    this.regSubscription = this.authService.regNewUser(user)
      .subscribe({
        next: (data: User) => {
          this.userReg.reset();
          this._snackBar.open(
            `Sikeres regisztáció`,
            'OK',
            {
              duration: 3000,
              panelClass: ['snackbar-ok']
            }
          );
          this.login(user);
        },

        error: (err) => {
          this._snackBar.open(
            `Hoppá, valami döcög a szerverkapcsolatban: \nSzerverválasz: ${err.error.message}: ${err.status}`,
            'OK',
            {
              duration: 5000,
              panelClass: ['snackbar-error']
            }
          );
          console.log(err);
        },

        complete: () => {
          this.dialogRef.close();
        }
      })
  }

  login(user: UserLogin) {

    this.loginSubscription = this.authService.login(user)
      .subscribe({
        next: (user: UserLoggedIn) => {
          this.getBartonsData(user._id);
        },
        error: (err) => {
          this._snackBar.open(
            `Hoppá, nem sikerült bejelentkezni! \n ${err.error.message}\nKód: ${err.status}`,
            'OK',
            {
              duration: 1000,
              panelClass: ['snackbar-error']
            }
          );
          console.error(err);
        },
        complete: () => {
          this.dialogRef.close();
          this._snackBar.open(`Sikeres belépés`, 'OK', { duration: 2000, panelClass: ['snackbar-ok'] });
          this.progress.isLoading = false;
          // this.router.navigate(['/']);
        }
      })
  }

  getBartonsData(id: string): void {

    this.progress.isLoading = true;

    console.log('getBartonsData called', id); // debug

    this.getBartonsDataSubscription = this.bartonService.getBartonsData(id).subscribe({
      next: () => { },
      error: (err: { error: { message: any; }; status: any; }) => {
        this._snackBar.open(
          `Hoppá, nem sikerült lekérni az udvar adatait! \n ${err.error.message}\nKód: ${err.status}`,
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

  getErrorMessage(formName: FormGroup, formControlName: string) {
    return this.validErrorHandler.getErrorMessage(formName, formControlName);
  }

}

