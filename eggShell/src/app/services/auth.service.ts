import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLoggedIn } from '../models/user-logged-in.model';
import { UserLogin } from '../models/user-login.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = environment.apiUrl;
  private userLoggedInObject: BehaviorSubject<UserLoggedIn | null> = new BehaviorSubject<UserLoggedIn | null>(null);

  constructor(private http: HttpClient) { }

  regNewUser(user: any): Observable<User> {
    return this.http.post<User>(`${this.BASE_URL}register`, user);
  }

  login(loginData: UserLogin): Observable<UserLoggedIn> {

    return this.http.post<UserLoggedIn>(this.BASE_URL + 'login', loginData)
      .pipe(
        tap({
          next: (loginData: UserLoggedIn) => {
            if (loginData) {
              localStorage.setItem('accessToken', loginData.accessToken);
              localStorage.setItem('refreshToken', loginData.refreshToken);
              this.userLoggedInObject.next(
                {
                  _id: loginData._id,
                  username: loginData.username,
                  email: loginData.email,
                  role: loginData.role,
                  bartons: loginData.bartons,
                  accessToken: loginData.accessToken,
                  refreshToken: loginData.refreshToken
                });
            }
          },
          error: (err) => {
            console.error('login error: ', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.userLoggedInObject.next(null);
          }
        })
      )
  }

  refreshUserAuthentication(): Observable<UserLoggedIn> {
    return this.http.post<any>(this.BASE_URL + 'refresh', { refreshToken: localStorage.getItem('refreshToken') })
      .pipe(
        tap({
            next: (res) => {
            if (res) {
              localStorage.setItem('accessToken', res.accessToken);
              this.userLoggedInObject.next({
                _id: res._id,
                username: res.username,
                email: res.email,
                role: res.role,
                bartons: res.bartons,
                accessToken: res.accessToken,
                refreshToken: res.refreshToken
              });
            }

          },
          error: (err) => {
            console.error('auth refresh error: ', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.userLoggedInObject.next(null);
          }
          })
      )
  }

  logout() {

    return this.http.post(this.BASE_URL + 'logout', { refreshToken: localStorage.getItem('refreshToken') })
      .pipe(
        tap({
          next: (res) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.userLoggedInObject.next(null);
          },
          error: (err) => {
            console.error('logout error: ', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.userLoggedInObject.next(null);
          }
        })
      )
  }

  getUserLoggedInObj() {
    return this.userLoggedInObject.asObservable();
  }

  getUserAuthData() {
    return this.userLoggedInObject.value;
  }

}
