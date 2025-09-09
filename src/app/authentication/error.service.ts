import {inject, Injectable} from '@angular/core';
import {Message, MessageResponse} from '../models/MessageResponse';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _handleLocalError = false;
  private _notificationsService = inject(ToastrService);

  constructor() { }

  handleGlobalError(messageResponse: MessageResponse): void {
    this._notificationsService.clear();
    if(!this._handleLocalError){
      this._handleLocalError = false;
      for (let message of messageResponse.messages) {
        if (message.type === Message.ALERT_TYPE_INFO) {
          this._notificationsService.info(message.message)
        }
        else if (message.type === Message.ALERT_TYPE_WARNING) {
          this._notificationsService.warning(message.message)
        }
        else if (message.type === Message.ALERT_TYPE_SUCCESS) {
          this._notificationsService.success(message.message)
        }
        else if (message.type === Message.ALERT_CONNECTION_REFUSED) {
          this._notificationsService.error(message.message, '', {timeOut: 10000})
        }
        else {
          this._notificationsService.error(message.message)
        }
      }
    } else {
      this._handleLocalError = false;
    }
  }
}
