import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserLogin, UserLoggedIn } from 'src/app/common/models/user.model';
// import { UserLoggedIn } from 'src/app/models/user-logged-in.model';
// import { UserLogin } from 'src/app/models/user-login.model';
import { AuthService } from 'src/app/auth/services/auth.service';
// import { BartonService } from 'src/app/barton/services/barton.service';
import { ProgressService } from 'src/app/common/services/progress.service';
import { ValidationErrorHandlerService } from 'src/app/common/services/validation-error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  hide = true;  // pwd visible switch

  loginSubscription: Subscription = new Subscription;
  getBartonsDataSubscription: Subscription = new Subscription;

  emailPattern: string | RegExp = '/^\S+@\S{2, }\.\S{2, }$/';

  userLogin = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      // Validators.pattern(this.emailPattern)
    ]),
    password: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.userLogin.controls['email'] as FormControl;
  }
  get password() {
    return this.userLogin.controls['password'] as FormControl;
  }

  constructor(
    private authService: AuthService,
    private validErrorHandler: ValidationErrorHandlerService,
    public dialogRef: MatDialogRef<LoginComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar,
    // private bartonService: BartonService,
    private progress: ProgressService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
    if (this.getBartonsDataSubscription) this.getBartonsDataSubscription.unsubscribe();
  }


  login(user: UserLogin) {

    this.progress.isLoading = true;

    this.loginSubscription = this.authService.login(user)
      .subscribe({
        next: (user: UserLoggedIn) => {
          // this.getBartonsData(user._id);
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
          this.dialogRef.close();
        },
        complete: () => {
          this.dialogRef.close();
          this.userLogin.reset();
          // this._snackBar.open(
          //   `Sikeres belépés`,
          //   'OK',
          //   {
          //     duration: 2000,
          //     panelClass: ['snackbar-ok']
          //   }
          // );
          this.progress.isLoading = false;
          // this.router.navigate(['/']);
        }
      })
  }

  // getBartonsData(id: string): void {

  //   this.progress.isLoading = true;

  //   console.log('getBartonsData called', id); // debug

  //   this.getBartonsDataSubscription = this.bartonService.getBartonsData(id).subscribe({
  //     next: () => { },
  //     error: (err: { error: { message: any; }; status: any; }) => {
  //       this._snackBar.open(
  //         `Hoppá, nem sikerült lekérni az udvar adatait! \n ${err.error.message}\nKód: ${err.status}`,
  //         'OK',
  //         {
  //           duration: 5000,
  //           panelClass: ['snackbar-error']
  //         }
  //       );
  //       console.error(err);
  //     },
  //     complete: () => {
  //       this.progress.isLoading = false;
  //     }
  //   })
  // }

  getErrorMessage(formName: FormGroup, formControlName: string) {
    return this.validErrorHandler.getErrorMessage(formName, formControlName);
  }

}