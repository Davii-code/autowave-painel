export class MessageResponse {
  constructor(public status?: number,
              public messages: Array<Message> = new Array<Message>,
  ) { }
}

export class Message {
  public static ALERT_TYPE_INFO = 'info';
  public static ALERT_TYPE_ERROR = 'error';
  public static ALERT_TYPE_SUCCESS = 'done';
  public static ALERT_TYPE_WARNING = 'warning';
  public static ALERT_CONNECTION_REFUSED = 'connectionRefused';

  constructor(
    public type?: string,
    public code?: string,
    public message?: string,
  ) { }
}
