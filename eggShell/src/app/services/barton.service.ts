import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, tap } from 'rxjs';
import { BartonToSave } from '../models/barton-to-save.model';
import { Barton } from '../models/barton.model';
import { FeedOfBartonToSave } from '../models/feed-of-barton-to-save.model';
import { FeedOfBarton } from '../models/feed-of-barton.model';
import { MedicineOfBartonToSave } from '../models/medicine-of-barton-to-save.model';
import { MedicineOfBarton } from '../models/medicine-of-barton.model';
import { PoultryOfBartonToSave } from '../models/poultry-of-barton-to-save.model';
import { PoultryOfBarton } from '../models/poultry-of-barton.model';
import { BartonHttpService } from './barton-http.service';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class BartonService {

  private bartonList: BehaviorSubject<Barton[] | []> = new BehaviorSubject<Barton[] | []>([]);
  private userHasBarton: boolean = false;

  constructor(
    private bartonHttp: BartonHttpService,
    // public progress: ProgressService,
  ) { }

  getBartonsData(userId: string): Observable<Barton[]> {

    // this.progress.isLoading = true;

    return this.bartonHttp.getAll(`?users.user=${userId}`)
      .pipe(
        tap({
          next: (bartonsData: Barton[]) => {
            this.userHasBarton = !!(bartonsData?.length);
            if (bartonsData && this.userHasBarton) {
              console.log('bartonsData at bartonService before transform: ', bartonsData);     // debug
              this.bartonList.next(
                this.incomingDataTransform(bartonsData)
              )
            } else if (bartonsData && !this.userHasBarton) {
              console.log('bartonsData at bartonService: ', bartonsData);     // debug
              this.bartonList.next(
                [
                  {
                    // _id: '',
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


  saveBartonData(): void {

    let dataSource: BartonToSave[] = this.outgoingDataTransform(this.getBartonListValue());

    for (const barton of dataSource) {

      console.log('newBarton before save: ', barton);    // debug

      if (!barton._id) {

        this.bartonHttp.saveBarton(barton)
          .subscribe({
            next: (data) => {
              console.log('Barton saved! ', data);    // debug
              // this.bartonList[barton].next(data)
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => { }
          })

      } else {
        if (barton._id) {
          this.bartonHttp.updateBarton(barton, barton._id)
            .subscribe({
              next: (data) => {
                console.log('Barton updated! ', data);    // debug
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => { }
            })
        } else {
          console.error('barton._id missing!');   // debug
        }
      }
    }
  }

  incomingDataTransform(data: any[]) {

    let transformedBartonList: Barton[] = [];

    for (const item of data) {

      let poultryOfBarton: PoultryOfBarton[] = [];
      let feedOfBarton: FeedOfBarton[] = [];
      let medicineOfBarton: MedicineOfBarton[] = [];

      if (!!item.poultry.length) {
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

      if (!!item.feed.length) {
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

      if (!!item.medicine.length) {
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
        bartonName: item.bartonName,
        users: item.users,
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
        _id: item._id,
        bartonName: item.bartonName,
        users: item.users,
        poultry: poultryOfBarton,
        feed: feedOfBarton,
        medicine: medicineOfBarton,
      }

      transformedBartonList.push(barton);

    }

    return transformedBartonList;
  }

  getBartonList(): Observable<Barton[]> {
    return this.bartonList.asObservable();
  }

  getBartonListValue(): Barton[] {
    return this.bartonList.value;
  }
}


