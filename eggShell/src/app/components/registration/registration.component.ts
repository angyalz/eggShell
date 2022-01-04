import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserLogin } from 'src/app/models/user-login.model';
import { AuthService } from 'src/app/services/auth.service';
// import { BaseHttpService } from 'src/app/services/base-http.service';
import { ValidationErrorHandlerService } from 'src/app/services/validation-error-handler.service';
import { matchValidator } from 'src/app/validators/match.validator';
import { passwordStrengthValidator } from 'src/app/validators/password-strength.validator';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  hide = true;  // pwd visible switch

  loginSubscription: Subscription = new Subscription;
  userObject: any;

  lettersOnlyPattern: string | RegExp = '^[a-zA-Z íöüóőúűéáÍÖÜÓŐÚŰÉÁ]+$';
  numbersOnlyPattern: string | RegExp = '^[0-9]+$';
  emailPattern: string | RegExp = '^\S+@\S{2,}\.\S{2,}$';

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
          Validators.pattern(this.emailPattern)
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
    // private httpService: HttpService,
    private authService: AuthService,
    private validErrorHandler: ValidationErrorHandlerService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.userReg);  // debug
  }

  regUser(user: any) {

    this.authService.regNewUser(user).subscribe({

      next: (data: any) => {
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
        next: () => { },
        error: (err) => {
          this._snackBar.open(
            `Hoppá, nem sikerült bejelentkezni! \nSzerverválasz: ${err.error.message}\nKód: ${err.status}`,
            'OK',
            {
              duration: 5000
            }
          );
          console.error(err);
        },
        complete: () => {
          this._snackBar.open(`Sikeres belépés`, 'OK', { duration: 2000 });
          this.router.navigate(['/recipes']);
        }
      })
  }

  getErrorMessage(formName: FormGroup, formControlName: string) {
    return this.validErrorHandler.getErrorMessage(formName, formControlName);
  }

}

