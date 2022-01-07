import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BartonToSave } from '../models/barton-to-save.model';
import { Barton } from '../models/barton.model'
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class BartonHttpService extends BaseHttpService<Barton>{

  constructor(public override http: HttpClient) {
    super(http);
    this.entity = 'bartons'
   }

  saveBarton(data: BartonToSave): Observable<BartonToSave> {
    return this.http.post<BartonToSave>(`${this.BASE_URL}${this.entity}`, data);
  }

  updateBarton(data: BartonToSave, id: string | undefined): Observable<BartonToSave> {
    return this.http.put<BartonToSave>(`${this.BASE_URL}${this.entity}/${id}`, data);
  }

}
