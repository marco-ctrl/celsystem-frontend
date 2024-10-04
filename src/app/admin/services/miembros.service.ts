import { computed, inject, Injectable, signal } from '@angular/core';
import { Asistente, ListAsistentes, Miembro, Visita } from '../interfaces/miembro-admin.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public _status = signal<boolean>(false);
  public _miembros = signal<Miembro[] | null>(null);
  public _asistencia = signal<Asistente[] | null | undefined>(null);
  public _visita = signal<Visita[] | null | undefined>(null);

  public miembros = computed(() => this._miembros());
  public asistencia = computed(() => this._asistencia());
  public visita = computed(() => this._visita());

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

}
