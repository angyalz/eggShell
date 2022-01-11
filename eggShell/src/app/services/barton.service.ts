import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, Subscription, tap } from 'rxjs';
import { BartonToSave } from '../models/barton-to-save.model';
import { Barton } from '../models/barton.model';
import { FeedOfBartonToSave } from '../models/feed-of-barton-to-save.model';
import { FeedOfBarton } from '../models/feed-of-barton.model';
import { MedicineOfBartonToSave } from '../models/medicine-of-barton-to-save.model';
import { MedicineOfBarton } from '../models/medicine-of-barton.model';
import { PoultryOfBartonToSave } from '../models/poultry-of-barton-to-save.model';
import { PoultryOfBarton } from '../models/poultry-of-barton.model';
import { UserLoggedIn } from '../models/user-logged-in.model';
import { UsersOfBarton } from '../models/users-of-barton.model';
import { AuthService } from './auth.service';
import { BartonHttpService } from './barton-http.service';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class BartonService {

  private bartonList$: BehaviorSubject<Barton[]> = new BehaviorSubject<Barton[]>([]);
  // private userHasBarton$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userHasBarton: boolean = false;
  // private userObject!: UserLoggedIn | null;
  // private userObjectSubscription: Subscription = this.authService.getUserLoggedInObj().subscribe(user => this.userObject = user);

  constructor(
    private bartonHttp: BartonHttpService,
    public progress: ProgressService,
    private authService: AuthService,
  ) { }

  getBartonsData(userId: string): Observable<Barton[]> {

      this.progress.isLoading = true;

      return this.bartonHttp.getAll(`?users.user=${userId}`)
        .pipe(
          tap({
            next: (bartonsData: Barton[]) => {
              this.userHasBarton = !!(bartonsData?.length);
              if (bartonsData && this.userHasBarton) {
              // this.userHasBarton$.next(!!(bartonsData?.length));
              // if (bartonsData && this.userHasBarton$) {
                console.log('bartonsData at bartonService before transform: ', bartonsData);     // debug
                this.bartonList$.next(
                  this.incomingDataTransform(bartonsData)
                )
                this.progress.isLoading = false;
              } else if (bartonsData && !this.userHasBarton) {
              // } else if (bartonsData && !this.userHasBarton$) {
                console.log('bartonsData at bartonService: ', bartonsData);     // debug
                this.bartonList$.next(
                  [
                    {
                      // _id: '',
                      active: true,
                      bartonName: 'Udvar 1',
                      users: [{
                        user: userId,
                        role: 'owner'
                      }],
                      poultry: []
                    }
                  ]
                )
                this.progress.isLoading = false;
              }
            }
          })
        )
  }

  saveBartonData(data?: Barton[]): void {

    this.progress.isLoading = true;

    let dataSource: BartonToSave[] = this.outgoingDataTransform(data) || this.outgoingDataTransform(this.getBartonListValue());
    let bartonList: BartonToSave[] = [];

    for (const barton of dataSource) {

      console.log('newBarton before save: ', barton);    // debug

      if (!barton._id) {

        this.bartonHttp.saveBarton(barton)
          .subscribe({
            next: (data) => {
              console.log('Barton saved! ', data);    // debug
              bartonList.unshift(data);
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => {
              this.progress.isLoading = false;
            }
          })

      } else {

        if (barton._id) {
          this.bartonHttp.updateBarton(barton, barton._id)
            .subscribe({
              next: (data) => {
                console.log('Barton updated! ', data);    // debug
                bartonList.unshift(data);
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                this.progress.isLoading = false;
              }
            })
        } else {
          console.error('barton._id missing!');   // debug
        }
      }
    }
    let user = this.authService.getUserAuthData();
    if (user) {
      this.getBartonsData(user._id);
    }
  }

  deleteBarton(barton: Barton): void {
    if (barton.poultry.length === 0) {
      this.bartonHttp.deleteById(barton._id)
        .subscribe({
          next: (data) => { },
          error: (err) => { console.error(err) },
          complete: () => { }
        })
    } else {
      this.bartonHttp.setBartonInactive(barton._id);
    }
    let user = this.authService.getUserAuthData();
    if (user) {
      this.getBartonsData(user._id);
    }
  }

  incomingDataTransform(data: any) {

    let transformedBartonList: Barton[] = [];

    for (const item of data) {

      let poultryOfBarton: PoultryOfBarton[] = [];
      let feedOfBarton: FeedOfBarton[] = [];
      let medicineOfBarton: MedicineOfBarton[] = [];
      let usersOfBarton: UsersOfBarton[] = [];

      if (item.users && !!item.users.length) {
        for (const elem of item.users) {

          let users: UsersOfBarton =
          {
            user: elem.user,
            role: elem.role
          }

          usersOfBarton.push(users);

        }
      }

      if (item.poultry && !!item.poultry.length) {
        for (const elem of item.poultry) {

          let poultry: PoultryOfBarton =
          {
            _id: elem.poultry._id,
            species: elem.poultry.species,
            sex: elem.poultry.sex,
            nameOfSex: elem.poultry.nameOfSex,
            image: elem.poultry.image,
            customName: elem.customName,
            quantity: elem.quantity,
            purchaseDate: elem.purchaseDate,
            purchasePrice: elem.purchasePrice,
            ageAtPurchase: elem.ageAtPurchase,
          }

          poultryOfBarton.push(poultry);

        }
      }

      if (item.feed && !!item.feed.length) {
        for (const elem of item.feed) {

          let feed: FeedOfBarton =
          {
            _id: elem.feed._id,
            type: elem.feed.type,
            unit: elem.unit,
            price: elem.price,
            dateFrom: elem.dateFrom,
            dateTo: elem.dateTo,
          }

          feedOfBarton.push(feed);

        }
      }

      if (item.medicine && !!item.medicine.length) {
        for (const elem of item.medicine) {

          let medicine: MedicineOfBarton =
          {
            _id: elem.medicine._id,
            type: elem.medicine.type,
            price: elem.price,
            dateFrom: elem.dateFrom,
            dateTo: elem.dateTo,
          }

          medicineOfBarton.push(medicine);

        }
      }

      let barton: Barton =
      {
        _id: item._id,
        active: item.active,
        bartonName: item.bartonName,
        users: usersOfBarton,
        poultry: poultryOfBarton,
        feed: feedOfBarton,
        medicine: medicineOfBarton,
      }

      transformedBartonList.push(barton);

    }

    return transformedBartonList;

  }

  outgoingDataTransform(data: any) {

    let transformedBartonList: BartonToSave[] = [];

    for (const item of data) {

      let poultryOfBarton: PoultryOfBartonToSave[] = [];
      let feedOfBarton: FeedOfBartonToSave[] = [];
      let medicineOfBarton: MedicineOfBartonToSave[] = [];

      if (item.poultry && !!item.poultry.length) {
        for (const elem of item.poultry) {

          let poultry: PoultryOfBartonToSave =
          {
            poultry: elem._id,
            customName: elem.customName,
            quantity: elem.quantity,
            purchaseDate: elem.purchaseDate,
            purchasePrice: elem.purchasePrice,
            ageAtPurchase: elem.ageAtPurchase,
          }

          poultryOfBarton.push(poultry);

        }
      }

      if (item.feed && !!item.feed.length) {
        for (const elem of item.feed) {

          let feed: FeedOfBartonToSave =
          {
            feed: elem.feed._id,
            unit: elem.unit,
            price: elem.price,
            dateFrom: elem.dateFrom,
            dateTo: elem.dateTo,
          }

          feedOfBarton.push(feed);

        }
      }

      if (item.medicine && !!item.medicine.length) {
        for (const elem of item.medicine) {

          let medicine: MedicineOfBartonToSave =
          {
            medicine: elem.medicine._id,
            price: elem.price,
            dateFrom: elem.dateFrom,
            dateTo: elem.dateTo,
          }

          medicineOfBarton.push(medicine);

        }
      }

      let barton: BartonToSave =
      {
        active: item.active,
        bartonName: item.bartonName,
        users: item.users,
        poultry: poultryOfBarton,
        feed: feedOfBarton,
        medicine: medicineOfBarton,
      }

      item._id ? barton._id = item._id : null;

      transformedBartonList.push(barton);

    }

    return transformedBartonList;
  }

  getBartonList(): Observable<Barton[]> {
    return this.bartonList$.asObservable();
  }

  getBartonListValue(): Barton[] {
    return this.bartonList$.value;
  }

  setBartonList(data: Barton[]): void {
    this.bartonList$.next(data);
    this.saveBartonData();                      // autoSave!!!
  }

  unsetBartonList(): void {
    this.bartonList$.next([]);
  }

  // getUserHasBarton(): Observable<boolean> {
  //   return this.userHasBarton$.asObservable();
  // }

  // getUserHasBartonValue(): boolean {
  //   return this.userHasBarton$.value;
  // }
}


