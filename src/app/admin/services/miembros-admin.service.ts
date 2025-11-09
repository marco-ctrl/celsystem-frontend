import { computed, inject, Injectable, signal } from '@angular/core';
import { Asistente, ListAsistentes, ListMemberResponse, MemberResponse, MembersPagination, Miembro, Visita } from '../interfaces/miembro-admin.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public _membersResponse = signal<ListMemberResponse | null>(null);
  public _membersList = signal<MembersPagination | null>(null);
  public _status = signal<boolean>(false);
  public _miembros = signal<Miembro[] | null>(null);
  public _asistencia = signal<Asistente[] | null | undefined>(null);
  public _visita = signal<Visita[] | null | undefined>(null);
  public _member = signal<Miembro | null>(null);
  public _message = signal<string | null>(null);

  public membersResponse = computed(() => this._membersResponse());
  public membersList = computed(() => this._membersList());
  public miembros = computed(() => this._miembros());
  public asistencia = computed(() => this._asistencia());
  public visita = computed(() => this._visita());
  public status = computed(() => this._status());
  public member = computed(() => this._member());
  public message = computed(() => this._message());

  constructor() { }

  addAsistencia(asistencia: Asistente): boolean{
    if(!this.asistencia()){
      this._asistencia.update(() => [asistencia]);
    }
    else{
      this._asistencia.update(() => [
        ...this.asistencia()!, asistencia])
    }
    return true;
  }

  addVisita(visita: Visita): boolean{
    if(!this.visita()){
      this._visita.update(() => [visita]);
    }
    else{
      this._visita.update(() => [
        ...this.visita()!, visita])
    }
    return true;
  }

  getAsistente(celulaId: number, term: string){
    const url = `${this.baseUrl}/api/admin_member/${celulaId}/asistencia?term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<ListAsistentes>(url, {headers})
    .pipe(
      map(({ status, members }) => {
        this._miembros.update(value => members);
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getVisita(celulaId: number, term: string){
    const url = `${this.baseUrl}/api/admin_member/${celulaId}/visita?term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<ListAsistentes>(url, {headers})
    .pipe(
      map(({ status, members }) => {
        this._miembros.update(value => members);
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getAllMembers(page: number, term: string): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_member?page=${page}&term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<ListMemberResponse>(url, {headers})
    .pipe(
      map(({ status, members }) => {
        this._membersList.set(members);
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  addMiembro(memberForm: Miembro): Observable<boolean>
  {
    const body = memberForm;
    const url = `${this.baseUrl}/api/admin_member`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.post<MemberResponse>(url, body, {headers})
    .pipe(
      map(({ status }) => {
        //this._me.set(celula);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  updateMiembro(memberForm: Miembro, id: number): Observable<boolean>
  {
    const body = memberForm;
    const url = `${this.baseUrl}/api/admin_member/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.put<MemberResponse>(url, body, {headers})
    .pipe(
      map(({ status }) => {
        //this._me.set(celula);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  getMemberById(id: number): Observable<Boolean> 
  {
    const url = `${this.baseUrl}/api/admin_member/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.get<MemberResponse>(url, {headers})
    .pipe(
      map(({ status, message, member }) => {
        this._member.set(member);
        return this._status.set(status)!;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  changeStatusMember(id:number): Observable<boolean>
  {
    const url = `${this.baseUrl}/api/admin_member/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<MemberResponse>(url, {headers})
    .pipe(
      map(({ status, message }) => {
        this._message.set(message!);
        this._status.set(status);
        return status;
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

}
