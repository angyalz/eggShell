import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Barton } from '../models/barton.model'
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class BartonHttpService extends BaseHttpService<Barton>{

  constructor(public override http: HttpClient) {
    super(http);
    this.entity = 'barton'
   }

  getAllBartons(): Observable<Barton[]> {
    return this.http.get<Barton[]>(`${this.BASE_URL}${this.entity}`)
  }
}
