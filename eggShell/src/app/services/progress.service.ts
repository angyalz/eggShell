import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  isLoading: boolean = true;

  constructor() { }

}
