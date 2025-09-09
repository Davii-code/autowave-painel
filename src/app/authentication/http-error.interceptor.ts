import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Message, MessageResponse} from '../models/MessageResponse';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((response: HttpErrorResponse): Observable<HttpEvent<Message>> => {
      const messageResponse = Object.assign(new MessageResponse(), response.error);

      if (messageResponse.statusCode === 403) {
        delete messageResponse.messages;
      }

      if (response.status === 0) {
        messageResponse.messages = [new Message(Message.ALERT_CONNECTION_REFUSED, "", "Erro ao estabelecer conexão com o sistema. Contactar os responsáveis!")];

      }

      this.errorService.handleGlobalError(messageResponse);

      return throwError(messageResponse);
    }));
  }
}
