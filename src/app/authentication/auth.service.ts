import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthDTO} from '../models/AuthDTO';
import {Observable} from 'rxjs';
import {CredentialDTO} from '../models/CredentialDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);

  //private _auth: string = 'https://13.61.16.36:8080/api/v1/auth';
  private _auth: string = 'http://localhost:8080/api/v1/auth';

  constructor() { }

  login(authDto: AuthDTO): Observable<CredentialDTO> {
    return this._http.post<CredentialDTO>(`${this._auth}/login`, authDto);
  }

  refresh(refreshToken: string): Observable<CredentialDTO> {
    let params = new HttpParams()
      .set('refreshToken', refreshToken);

    return this._http.get<CredentialDTO>(`${this._auth}/refresh`, {
      params: params
    });
  }

  logout(token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this._http.get<any>(`${this._auth}/logout`, {
      headers: headers,
    });
  }

  sendRecoveryCode(email: string): Observable<any> {
    return this._http.get<any>(`${this._auth}/forgot-password?email=${email}`);
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this._http.get<any>(`${this._auth}/verify-code?email=${email}&code=${code}`);
  }

  changePassword(email: string, code: string, password: string): Observable<any> {
    return this._http.get<any>(`${this._auth}/change-password?email=${email}&code=${code}&password=${password}`);
  }
}
