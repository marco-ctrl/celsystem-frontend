import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() { }

  getExcelAllInformes(inicio: string, final: string): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.baseUrl}/api/admin_excel/informe-export?inicio=${inicio}&final=${final}`, { responseType: 'blob', headers });
  }
}
