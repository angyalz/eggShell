import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { User, UserLoggedIn } from '../models/user.model';
import { UserHttpService } from './user-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private BASE_URL = environment.apiUrl;
  // private userLoggedInObject$: Observable<UserLoggedIn | null> = this.authService.getUserLoggedInObj();
  private userData: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  // private userId!: User['_id'];


  constructor(
    private authService: AuthService,
    private userHttpService: UserHttpService,
  ) { 
    this.getUserObject();
  }

  private getUserObject(): void {
    this.authService.getUserLoggedInObj().subscribe({
      next: (user) => {
        if (user) {
          this.userHttpService.getById(user._id).subscribe({
            next: (user) => { this.userData.next(user) }
          })
        } else {
          this.userData.next(null);
        }
      }
    })
  }

  getUserData(): Observable<User | null> {
    return this.userData.asObservable();
  }

  setUserData(data: User): void {
    this.userData.next(data);
  }
  
}
