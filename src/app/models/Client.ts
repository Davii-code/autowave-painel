import {UserSecond} from './UserSecond';

export interface Client {
  id?: number;
  name: string;
  telephone?: string;
  dateofbirth?: string;
  lastPurchase?: string;
  user?: UserSecond;

}

export type SortData = { sortParam: string; sortDirection: 'asc' | 'desc' };
