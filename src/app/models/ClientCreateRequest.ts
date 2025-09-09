import {UserSecond} from './UserSecond';

export interface ClientCreateRequest {
  name: string;
  telephone: string;
  dateofbirth: string;
  lastPurchase?: string;
  user: UserSecond;
}
