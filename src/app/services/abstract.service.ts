import {inject, Injectable} from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SecurityService} from '../authentication/security/security.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractService<T> {
  protected url: string;
  protected securityService = inject(SecurityService);

  protected constructor(protected httpService: HttpClient, baseUrl: string) {
    this.url = `${myGlobals.API_URL}/${baseUrl}`;
  }

  listar(filtroObjeto: any, pageNumber: number, pageSize: number, sortData: any): Observable<any[]> {
    let params;
    if (sortData) {
      params = new HttpParams()
        .set('page', pageNumber)
        .set('size', pageSize)
        .set('sort', `${sortData.sortParam},${sortData.sortDirection}`)
    } else {
      params = new HttpParams()
        .set('page', pageNumber)
        .set('size', pageSize)
    }

    return this.httpService.get<any[]>(this.url,{
      headers: this.createHeaders(),
      params: params
    })
      .pipe(
        catchError(this.handleError)
      );
  }


  consultarPorId(id:number): Observable<any[]> {
    return this.httpService.get<any[]>(`${this.url}/${id}`,{
      headers: this.createHeaders()
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  consultarView(id:number): Observable<any[]> {
    return this.httpService.get<any[]>(`${this.url}/view/${id}`,{
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  update(dado: any, id: number): Observable<T> {
    return this.httpService.put<T>(`${this.url}/${id}`, dado, {
      headers: this.createHeaders()
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  save(dado: any): Observable<any> {
    console.log(this.createHeaders())
    return this.httpService.post<any>(`${this.url}`, dado, {
      headers: this.createHeaders()
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  filter(dado: string): Observable<any> {
    let headers = new HttpHeaders();
    if (this.securityService.isValid()) {
      headers = this.createHeaders();
    }

    return this.httpService.get<any>(`${this.url}/search/${dado}`, {
      headers: headers
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  excluir(id: number): Observable<void> {
    return this.httpService.delete<void>(`${this.url}/${id}`, {
      headers: this.createHeaders()
    })
      .pipe(
        catchError(this.handleError)
      );
  }
}
