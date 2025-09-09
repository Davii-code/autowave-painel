import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensageiroService {
  private apiUrl = 'http://localhost:8080/api/v1/evolution';

  private _http = inject(HttpClient);

  constructor() {}

  connect(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/instance/connect`);
  }

  logout(): Observable<any> {
    return this._http.delete<any>(`${this.apiUrl}/instance/logout`);
  }

  status(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/instance/status`);
  }

  sendMessage(dto: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/sendMessage`, dto);
  }
}
