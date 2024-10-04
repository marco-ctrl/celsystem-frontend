import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, throwError } from 'rxjs';
import { Lider, Lideres, LiderForm, LiderResponse, ListLideres } from '../interfaces/lider-admin.interface';
import { environment } from '../../../environments/environments';
import { StateWaitResponseService } from '@services/state-wait-response.service';

@Injectable({
  providedIn: 'root'
})
export class LiderAdminService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  private _lideres  = signal<Lideres | null>(null);
  private _status   = signal<Boolean>(false);
  public _lider     = signal<Lider | null>(null);
  public _editLider = signal<Boolean>(false);
  public _message   = signal<String>('');

  public lideres = computed(() => this._lideres());
  public status  = computed(() => this._status());
  public lider   = computed(() => this._lider());
  public message = computed(() => this._message());

  constructor() { }

  getAllLideres(page: number, term: string): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_lider?page=${page}&term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<ListLideres>(url, {headers})
    .pipe(
      map(({ status, lideres }) => {
        this._lideres.set(lideres)
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getLiderById(id: number): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_lider/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<LiderResponse>(url, {headers})
    .pipe(
      map(({ status, lider }) => {
        this._lider.update(value => lider);
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }
  
  addLider(liderForm: LiderForm): Observable<boolean>
  {
    const body = liderForm;
    const url = `${this.baseUrl}/api/admin_lider`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.post<LiderResponse>(url, body, {headers})
    .pipe(
      map(({ status, lider, message }) => {
        this._lider.set(lider);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  updateLider(liderForm: LiderForm, id:number): Observable<boolean>
  {
    const body = liderForm;
    const url = `${this.baseUrl}/api/admin_lider/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.put<LiderResponse>(url, body, {headers})
    .pipe(
      map(({ status, lider, message }) => {
        this._lider.set(lider);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  changeStatusLider(id:number): Observable<boolean>
  {
    const url = `${this.baseUrl}/api/admin_lider/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<LiderResponse>(url, {headers})
    .pipe(
      map(({ status, lider, message }) => {
        this._message.set(message!);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }
}