import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, tap } from 'rxjs';
import { BartonToSave } from '../models/barton-to-save.model';
import { Barton } from '../models/barton.model';
import { FeedOfBarton } from '../models/feed-of-barton.model';
import { MedicineOfBarton } from '../models/medicine-of-barton.model';
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
            if (bartonsData && bartonsData.length !== 0) {
              this.bartonList.next(
                this.incomingDataTransform(bartonsData)
              )
            } else if (bartonsData) {
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
    let dataToSave!: BartonToSave[];
    let dataSource: Barton[] = this.getBartonListValue();
    // JSON.parse(JSON.stringify(this.getBartonListValue()));
    console.log('dataToSave: ', dataToSave);    // debug
    console.log('dataSource: ', dataSource);    // debug
    for (const barton in dataSource) {
      // console.log('dataSource[barton]: ', dataSource[barton]);    // debug
      // dataToSave[barton].bartonName = dataSource[barton].bartonName;
      // console.log('dataToSave[barton]: ', dataToSave[barton]);    // debug
      // for (const user in dataSource[barton].users) {
      //   dataToSave[barton].users[user].user = dataSource[barton].users[user].user;
      //   dataToSave[barton].users[user].role = dataSource[barton].users[user].role;
      // }
      // for (const poultry in dataSource[barton].poultry) {
      //   dataToSave[barton].poultry[poultry].species = dataSource[barton].poultry[poultry]._id;
      //   dataToSave[barton].poultry[poultry].customName = dataSource[barton].poultry[poultry].customName;
      //   dataToSave[barton].poultry[poultry].quantity = dataSource[barton].poultry[poultry].quantity;
      //   dataToSave[barton].poultry[poultry].purchaseDate = dataSource[barton].poultry[poultry].purchaseDate;
      //   dataToSave[barton].poultry[poultry].purchasePrice = dataSource[barton].poultry[poultry].purchasePrice;
      //   dataToSave[barton].poultry[poultry].ageAtPurchase = dataSource[barton].poultry[poultry].ageAtPurchase;
      // }

      let newBarton: any = {};
      newBarton.users = [];
      newBarton.poultry = [];
      console.log('typeof(newBarton): ', typeof (newBarton));    // debug  
      console.log('dataSource[barton]: ', dataSource[barton]);    // debug
      console.log('newBarton: ', newBarton);    // debug
      newBarton.bartonName = dataSource[barton].bartonName;
      // console.log('dataToSave[barton]: ', dataToSave[barton]);    // debug
      for (const user in dataSource[barton].users) {
        let newUser: any = {};
        newUser.user = dataSource[barton].users[user].user;
        newUser.role = dataSource[barton].users[user].role;

        newBarton.users.push(newUser);
      }
      for (const poultry in dataSource[barton].poultry) {
        let newPoultry: any = {};
        // newPoultry.type = dataSource[barton].poultry[poultry]._id;
        newPoultry.customName = dataSource[barton].poultry[poultry].customName;
        newPoultry.quantity = dataSource[barton].poultry[poultry].quantity;
        newPoultry.purchaseDate = dataSource[barton].poultry[poultry].purchaseDate;
        newPoultry.purchasePrice = dataSource[barton].poultry[poultry].purchasePrice;
        newPoultry.ageAtPurchase = dataSource[barton].poultry[poultry].ageAtPurchase;

        newBarton.poultry.push(dataSource[barton].poultry[poultry]._id);
        newBarton.poultry.push(newPoultry);
      }

      // dataToSave.push(newBarton);

      if (!newBarton._id) {

        this.bartonHttp.saveBarton(newBarton)
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
        if (newBarton._id) {
          this.bartonHttp.updateBarton(dataToSave[barton], dataToSave[barton]._id)
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

  getBartonList() {
    return this.bartonList.asObservable();
  }

  getBartonListValue() {
    return this.bartonList.value;
  }
}


