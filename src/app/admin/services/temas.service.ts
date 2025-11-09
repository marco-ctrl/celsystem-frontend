import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lesson, Lessons, TemaForm, TemaResponse, Temas } from '../interfaces/temas.interface';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemasService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _temas   = signal<Lessons | null>(null);
  public _tema     = signal<Lesson | null>(null);
  public _status   = signal<Boolean>(false);
  public _message  = signal<String>('');
  public _editTema = signal<Boolean>(false);

  public temas = computed(() => this._temas());
  public tema = computed(() => this._tema());
  public status = computed(() => this._status());
  public message = computed(() => this._message());
  public editTema = computed(() => this._editTema()); 

  constructor() { }

  getAllTemas(page: number, term: string): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_weekly_lesson?page=${page}&term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<Temas>(url, {headers})
    .pipe(
      map(({ status, lessons }) => {
        this._temas.set(lessons)
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  addTema(temaForm: any): Observable<boolean>
  {
    const body = temaForm;
    const url = `${this.baseUrl}/api/admin_weekly_lesson`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.post<TemaResponse>(url, body, {headers})
    .pipe(
      map(({ status, lesson }) => {
        this._tema.set(lesson);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

}