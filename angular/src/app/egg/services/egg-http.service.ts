import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from 'src/app/common/services/base-http.service';
import { EggList } from '../modles/egg.model';

@Injectable({
  providedIn: 'root'
})
export class EggHttpService extends BaseHttpService<EggList> {

  constructor(public override http: HttpClient) {
    super(http);
    this.entity = 'eggs'
  }
}
