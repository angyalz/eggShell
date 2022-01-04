import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, tap } from 'rxjs';
import { Barton } from '../models/barton.model';
import { BartonHttpService } from './barton-http.service';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class BartonService {

  bartonList: BehaviorSubject<Barton[] | []> = new BehaviorSubject<Barton[] | []>([]);

  constructor(
    private bartonHttp: BartonHttpService,
    // public progress: ProgressService,
  ) { }

  getBartonsData(userId: string): Observable<Barton[]> {

    // this.progress.isLoading = true;

    return this.bartonHttp.getBartonsByUserId(userId)
      .pipe(
        tap({
          next: (bartonsData: Barton[]) => {
            if (bartonsData && bartonsData.length !== 0) {
              this.bartonList.next(
                bartonsData
              )
            } else if (bartonsData) {
              this.bartonList.next(
               [
                {
                  _id: '',
                  bartonName: 'Udvar 1',
                  users: [{
                    user: userId,
                    role: 'owner'
                  }],
                  poultry: []
                }
               ]
              )
            }
          }
        })
      )
  }
}


