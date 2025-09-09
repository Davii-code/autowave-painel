import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {SecurityService} from './security.service';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  private _securityService = inject(SecurityService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._securityService.isValid()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this._securityService.credential.accessToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse): Observable<HttpEvent<any>> => {
        if (response.status === 401) {
          this._securityService.onUnauthorized.emit(this._securityService.credential);
        }

        if (response.status === 403) {
          this._securityService.onForbidden.emit(this._securityService.credential);
        }

        return throwError(response);
      })
    );
  }
}
