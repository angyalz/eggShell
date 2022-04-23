import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import 'moment/locale/hu';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import * as _rollupMoment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { Barton } from 'src/app/barton/models/barton.model';
import { BartonService } from 'src/app/barton/services/barton.service';

const moment = _rollupMoment || _moment;
// const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const HU_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM',
  },
};

@Component({
  selector: 'app-add-egg',
  templateUrl: './add-egg.component.html',
  styleUrls: ['./add-egg.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'hu' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: HU_FORMATS },
  ],
})

export class AddEggComponent implements OnInit, OnDestroy {

  bartonsData!: Barton[];
  bartonsData$: Observable<Barton[]> = this.bartonService.getBartonList();
  bartonSubscribe: Subscription = this.bartonService.getBartonList().subscribe(data => this.bartonsData = data);

  

  date = new FormControl(moment());
  minDate: Date;
  maxDate: Date = new Date;

  constructor(
    private bartonService: BartonService,
  ) { 
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 2, 0, 1);
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.bartonSubscribe) this.bartonSubscribe.unsubscribe();
  }

}
