import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Poultry } from '../models/poultry.model';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class PoultryHttpService extends BaseHttpService<Poultry>{

  constructor(public override http: HttpClient) {
    super(http);
    this.entity = 'poultry';
  }

  getAllPoultry(): Observable<Poultry[]> {
    return this.http.get<Poultry[]>(`${this.BASE_URL}${this.entity}`)
  }
}
