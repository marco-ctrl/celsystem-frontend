import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, throwError } from 'rxjs';
import { Lider, LideresPagination, LiderForm, LiderResponse, ListLideresResponse } from '../interfaces/lider-admin.interface';
import { environment } from '../../../environments/environments';
//import { StateWaitResponseService } from '@services/state-wait-response.service';

@Injectable({
  providedIn: 'root'
})
export class LiderAdminService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _lideresResponse  = signal<ListLideresResponse | null>(null);
  private _lideresList = signal<LideresPagination | null>(null);
  private _lider = signal<Lider | null>(null);
  private _status   = signal<Boolean>(false);
  public _lideres     = signal<Lider[] | null>(null);
  public _message   = signal<String>('');
  public _token     = signal<string>('');

  public lideresResponse = computed(() => this._lideresResponse());
  public lideresList = computed(() => this._lideresList());
  public lider = computed(() => this._lider());
  public status  = computed(() => this._status());
  public lideres   = computed(() => this._lideres());
  public message = computed(() => this._message());
  public token   = computed(() => this._token());

  constructor() { }

  getAllLideres(page: number, term: string, per_page: number): Observable<Boolean>
  {
    const url = `${this.baseUrl}/api/admin_lider?page=${page}&term=${term}&per_page=${per_page}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<ListLideresResponse>(url, {headers})
    .pipe(
      map(({ status, lideres }) => {
        this._lideresList.set(lideres);
        this._lideres.set(lideres.data);
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
        //this._lider.update(value => lider);
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
      map(({ status, lider, message, token, user, pass }) => {
        this._lider.set(lider);
        this._status.set(status);
        this._token.set(token);

        if (status && lider!.contact) {
        // URL del sistema
        const appUrl = `${window.location.origin}/`;

        // Mensaje personalizado de WhatsApp
        const mensaje = `Hola ${lider!.name}! 👋\n\n` +
                        `Tu cuenta fue creada exitosamente.\n` +
                        `Puedes acceder a la plataforma aquí:\n${appUrl}\n\n` +
                        `📧 Usuario: ${user?.email}\n🔑 Contraseña: ${pass}\n\n` +
                        `¡Bendiciones! 🙌`;

        // Sanitizar número (eliminar espacios, guiones, +)
        const numero = lider!.code + lider!.contact.replace(/\D/g, '');

        // Crear link de WhatsApp (sin redirigir en móviles)
        const whatsappUrl = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

        // Abrir nueva pestaña con el mensaje
        window.open(whatsappUrl, '_blank');
      }

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
