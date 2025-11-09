import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() { }

  getPdfInforme(reportId: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.baseUrl}/api/admin_pdf/informe/${reportId}`, { responseType: 'blob', headers });
  }

  getPdfAllInformes(inicio: string, final: string): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.baseUrl}/api/admin_pdf/reporte-informe?inicio=${inicio}&final=${final}`, { responseType: 'blob', headers });
  }

  getPdfReporteCelulas(tipe: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.baseUrl}/api/admin_pdf/reporte-celula?tipe=${tipe}`, { responseType: 'blob', headers });
  }
}
