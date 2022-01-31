import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Poultry } from '../models/poultry.model';
import { BaseHttpService } from '../../common/services/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class PoultryHttpService extends BaseHttpService<Poultry>{

  constructor(public override http: HttpClient) {
    super(http);
    this.entity = 'poultry';
  }

}
