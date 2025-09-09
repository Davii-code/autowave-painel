import {UserSecond} from './UserSecond';

export interface Campaing {
  id?: number;
  name: string;
  scheduledDate?: string;
  type?: string;
  messageTemplate?: string;
  user?: UserSecond;

}
