export interface Client {
  id?: number;
  name: string;
  telephone?: string;
  dateofbirth?: string;     // LocalDate -> enviar como 'YYYY-MM-DD'
  lastPurchase?: string;
  user?: any;

}

export type SortData = { sortParam: string; sortDirection: 'asc' | 'desc' };
