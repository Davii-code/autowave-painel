import {inject, Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SecurityService} from '../authentication/security/security.service';
import * as myGlobals from './globals';

@Injectable({ providedIn: 'root' })
export abstract class AbstractService<T> {
  protected url: string;

  protected constructor(protected httpService: HttpClient, baseUrl: string) {
    this.url = `${myGlobals.API_URL}/${baseUrl}`;
  }

  listar(
    filtroObjeto: any, // mantido para compatibilidade, ainda não usado
    pageNumber: number,
    pageSize: number,
    sortData?: { sortParam: string; sortDirection: 'asc' | 'desc' }
  ): Observable<any[]> {
    const params = new HttpParams({
      fromObject: {
        page: String(pageNumber),
        size: String(pageSize),
        ...(sortData ? { sort: `${sortData.sortParam},${sortData.sortDirection}` } : {})
      }
    });

    return this.httpService
      .get<any[]>(this.url, { params })
      .pipe(catchError(this.handleError));
  }

  consultarPorId(id: number): Observable<any[]> {
    return this.httpService
      .get<any[]>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  consultarView(id: number): Observable<any[]> {
    return this.httpService
      .get<any[]>(`${this.url}/view/${id}`)
      .pipe(catchError(this.handleError));
  }

  update(dado: any, id: number): Observable<T> {
    return this.httpService
      .put<T>(`${this.url}/${id}`, dado)
      .pipe(catchError(this.handleError));
  }

  save(dado: any): Observable<any> {
    return this.httpService
      .post<any>(`${this.url}`, dado)
      .pipe(catchError(this.handleError));
  }

  filter(dado: string): Observable<any> {
    return this.httpService
      .get<any>(`${this.url}/search/${dado}`)
      .pipe(catchError(this.handleError));
  }

  excluir(id: number): Observable<void> {
    return this.httpService
      .delete<void>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: any): Observable<never> {
    const message =
      (typeof error?.error === 'string' && error.error) ||
      error?.error?.message ||
      error?.message ||
      'Unexpected error';
    return throwError(() => new Error(message));
  }
}
