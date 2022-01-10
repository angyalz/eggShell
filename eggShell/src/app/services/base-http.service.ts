import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService<E> {

  BASE_URL = environment.apiUrl;
  entity!: string;

  constructor(public http: HttpClient) { }

  getAll(query: string = ''): Observable<Array<E>> {
    return this.http.get<Array<E>>(`${this.BASE_URL}${this.entity}${query}`);
  }

  getById(id: string): Observable<E> {
    return this.http.get<E>(`${this.BASE_URL}${this.entity}/${id}`);
  }

  save(entity: E): Observable<E> {
    return this.http.post<E>(`${this.BASE_URL}${this.entity}`, entity);
  }

  update(entity: E, id: string | undefined): Observable<E> {
    return this.http.put<E>(`${this.BASE_URL}${this.entity}/${id}`, entity);
  }

  deleteById(id: string | undefined): Observable<any> {
    return this.http.delete(`${this.BASE_URL}${this.entity}/${id}`);
  }

}
