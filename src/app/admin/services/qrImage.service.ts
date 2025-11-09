import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QrImage, QrImageResponse, QrImagesPagination, QrImagesResponse } from '../interfaces/qr-image.interface';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrImageService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _qrImagesResponse = signal<QrImageResponse | null>(null);
  private _qrImages = signal<QrImagesPagination | null>(null);
  public _qrImage = signal<QrImage | null>(null);
  public _status = signal<Boolean>(false);
  public _message = signal<String>('');

  public qrImagesResponse = computed(() => this._qrImagesResponse());
  public qrImages = computed(() => this._qrImages());
  public qrImage = computed(() => this._qrImage());
  public status = computed(() => this._status());
  public message = computed(() => this._message());

  constructor() { }

  getAllQrImages(page: number, term: string): Observable<Boolean> {
    const url = `${this.baseUrl}/api/admin_qr_image?page=${page}&term=${term}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<QrImagesResponse>(url, { headers })
      .pipe(
        map(({ status, qrImages }) => {
          this._qrImages.set(qrImages)
          return this._status.set(status)!;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  getShowActiveQrImages(): Observable<Boolean> {
    const url = `${this.baseUrl}/api/admin_qr_image/show/active`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<QrImageResponse>(url, { headers })
      .pipe(
        map(({ status, qrImage }) => {
          this._qrImage.set(qrImage)
          return this._status.set(status)!;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  downloadImage(qrImage: QrImage) {
    const url = `${this.baseUrl}/api/admin_qr_image/${qrImage.id}/download`;
    this.http
      .get(url, { responseType: 'blob' })
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Nombre dinámico del archivo
        a.download = 'qr-image-' + new Date().getTime() + '.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Liberar memoria
        window.URL.revokeObjectURL(url);
      });
  }

  addQrImage(qrImage: any): Observable<Boolean> {
    const body = qrImage
    const url = `${this.baseUrl}/api/admin_qr_image`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    console.log(token);

    return this.http.post<QrImageResponse>(url, body, { headers })
      .pipe(
        map(({ status, qrImage }) => {
          this._qrImage.set(qrImage);
          this._status.set(status);
          return status;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  updateQrImage(id: number, qrImage: any): Observable<Boolean> {
    const body = qrImage
    const url = `${this.baseUrl}/api/admin_qr_image/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.post<QrImageResponse>(url, body, { headers })
      .pipe(
        map(({ status, qrImage }) => {
          this._qrImage.set(qrImage);
          this._status.set(status);
          return status;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

  deleteQrImage(id: number): Observable<Boolean> {
    const url = `${this.baseUrl}/api/admin_qr_image/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
      
    return this.http.delete<QrImageResponse>(url, { headers })
      .pipe(
        map(({ status, message }) => {
          this._message.set(message || '');
          this._status.set(status);
          return status;
        }),
        catchError(err => throwError(() => err.error.message))
      );
  }

}
