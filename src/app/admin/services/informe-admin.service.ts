import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { InformeForm, InformeResponse, ListInformesResponse, Report, ReportsPagination } from '../interfaces/informe-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class InformeAdminService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  
  private _informes   = signal<ReportsPagination | null>(null);
  private _status     = signal<Boolean>(false);
  public _informe     = signal<Report | null>(null);
  public _editinforme = signal<Boolean>(false);
  public _message     = signal<String>('');

  public informees = computed(() => this._informes());
  public status  = computed(() => this._status());
  public informe   = computed(() => this._informe());
  public message = computed(() => this._message());

  constructor() { }

  getAllinformees(page: number, term: string): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_report?page=${page}&term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<ListInformesResponse>(url, {headers})
    .pipe(
      map(({ status, reports }) => {
        this._informes.set(reports)
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getReportInformees(page: number, inicio: string, final: string): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_report/filtrar/informe?page=${page}&inicio=${inicio}&final=${final}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<ListInformesResponse>(url, {headers})
    .pipe(
      map(({ status, reports }) => {
        this._informes.set(reports)
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getInformeById(id: number): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_report/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<InformeResponse>(url, {headers})
    .pipe(
      map(({ status, report }) => {
        this._informe.update(value => report);
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }
  
  addInforme(informeForm: InformeForm): Observable<boolean>
  {
    const body = informeForm;
    const url = `${this.baseUrl}/api/admin_report`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.post<InformeResponse>(url, body, {headers})
    .pipe(
      map(({ status, report }) => {
        this._informe.set(report);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  updateInforme(informeForm: any, id:number): Observable<boolean>
  {
    const body = informeForm;
    const url = `${this.baseUrl}/api/admin_report/update/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.post<InformeResponse>(url, body, {headers})
    .pipe(
      map(({ status, report, message }) => {
        this._informe.set(report);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  changeStatusInforme(id:number): Observable<boolean>
  {
    const url = `${this.baseUrl}/api/admin_report/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<InformeResponse>(url, {headers})
    .pipe(
      map(({ status, report, message }) => {
        this._message.set(message!);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }
}