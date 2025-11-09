import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CantidadAsistencia } from '../interfaces/cantidad-asistencia';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TotalMembers } from '../interfaces/home.interface';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _cantidadAsistencia = signal<CantidadAsistencia | null>(null);
  private _labelBar = signal<string[] | null>(null);
  private _dataBar = signal<number[] | null>(null);
  private _statusBar = signal<boolean>(false);

  private _totalMiembros = signal<TotalMembers | null>(null);
  private _labelPie = signal<string[] | null>(null);
  private _dataPie = signal<number[] | null>(null);
  private _statusPie = signal<boolean>(false);

  public cantidadAsistencia = computed(() => this._cantidadAsistencia());
  public labelBar = computed(() => this._labelBar());
  public dataBar = computed(() => this._dataBar());

  public totalMiembros = computed(() => this._totalMiembros());
  public labelPie = computed(() => this._labelPie());
  public dataPie = computed(() => this._dataPie());

  constructor() { }

  getAllResultBar(year: Number): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_home/assistant-amount?&year=${year}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<CantidadAsistencia>(url, {headers})
    .pipe(
      map(({ label, data, status }) => {
        this._labelBar.set(label);
        this._dataBar.set(data);
        return this._statusBar.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getAllResultPie(): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_home/total-members-tipe`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      //console.log('se ejecuta');
      
    return this.http.get<TotalMembers>(url, {headers})
    .pipe(
      map(({ tipe, total, status }) => {
        this._labelPie.set(tipe);
        this._dataPie.set(total);
        console.log(this.labelPie());
        console.log(this.dataPie());
        return this._statusPie.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

}
