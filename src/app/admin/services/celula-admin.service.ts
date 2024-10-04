import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environments';
import { CelulaForm, CelulaResponse, Celulas, ListCelulas } from '../interfaces/celula-admin.interface';
import { Celula } from '../interfaces/celula-admin.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { MapCelula } from '../interfaces/map-celula.';

@Injectable({
  providedIn: 'root'
})
export class CelulaAdminService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  private _celulas    = signal<Celulas | null>(null);
  private _mapCelulas = signal<MapCelula | null>(null);
  private _status     = signal<Boolean>(false);
  public _celula      = signal<Celula | null>(null);
  public _editCelula  = signal<Boolean>(false);
  public _message     = signal<String>('');

  public celulaes   = computed(() => this._celulas());
  public status     = computed(() => this._status());
  public celula     = computed(() => this._celula());
  public mapCelulas = computed(() => this._mapCelulas()); 
  public message    = computed(() => this._message());

  constructor() { }

  getAllcelulaes(page: number, term: string): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_celula?page=${page}&term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<ListCelulas>(url, {headers})
    .pipe(
      map(({ status, celulas }) => {
        this._celulas.set(celulas)
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getcelulaById(id: number): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_celula/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<CelulaResponse>(url, {headers})
    .pipe(
      map(({ status, celula }) => {
        this._celula.update(value => celula);
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }
  
  addcelula(celulaForm: CelulaForm): Observable<boolean>
  {
    const body = celulaForm;
    const url = `${this.baseUrl}/api/admin_celula`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.post<CelulaResponse>(url, body, {headers})
    .pipe(
      map(({ status, celula, message }) => {
        this._celula.set(celula);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  updateCelula(celulaForm: CelulaForm, id:number): Observable<boolean>
  {
    const body = celulaForm;
    const url = `${this.baseUrl}/api/admin_celula/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.put<CelulaResponse>(url, body, {headers})
    .pipe(
      map(({ status, celula, message }) => {
        this._celula.set(celula);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  changeStatuscelula(id:number): Observable<boolean>
  {
    const url = `${this.baseUrl}/api/admin_celula/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<CelulaResponse>(url, {headers})
    .pipe(
      map(({ status, celula, message }) => {
        this._message.set(message!);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getMapCelula(page: number, term: string): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_celula/map/celula?page=${page}&term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<MapCelula>(url, {headers})
    .pipe(
      map( mapCelula => {
        this._mapCelulas.set(mapCelula);
        return this.mapCelulas()!.status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }
}