import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Card, Cards } from '../interfaces/home.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  public _cards = signal<Card[] | null>(null);
  public _status = signal<Boolean>(false);

  public cards = computed(() => this._cards());
  public status = computed(() => this._status());

  constructor() { }

  getCards(): Observable<Boolean>
  {
    const url = `${this.baseUrl}/api/admin_home/card`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<Cards>(url, {headers})
    .pipe(
      map(({ status, data }) => {
        this._cards.set(data)
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

}
