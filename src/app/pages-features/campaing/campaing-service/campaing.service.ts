import { Injectable } from '@angular/core';
import {AbstractService} from '../../../services/abstract.service';
import {Campaing} from '../../../models/Campaing';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SortData} from '../../../models/Client';

@Injectable({
  providedIn: 'root'
})
export class CampaingService extends AbstractService<Campaing> {
  constructor(http: HttpClient) {
    super(http, 'campaign'); // baseUrl da API -> /Campaing
  }

  /** Lista paginada tipada, adaptando diferentes formatos de resposta. */
  listarCampaing(
    filtro: any,
    pageNumber: number,
    pageSize: number,
    sortData?: SortData
  ): Observable<{ content: Campaing[]; total: number }> {
    return super.listar(filtro, pageNumber, pageSize, sortData as any).pipe(
      map((res: any) => {
        if (Array.isArray(res)) {
          return { content: res as Campaing[], total: res.length };
        }
        if (res?.content) {
          return {
            content: res.content as Campaing[],
            total: (res.totalElements ?? res.total ?? res.content.length) as number
          };
        }
        if (res?.items) {
          return {
            content: res.items as Campaing[],
            total: (res.total ?? res.count ?? res.items.length) as number
          };
        }
        return { content: [], total: 0 };
      })
    );
  }

  getById(id: number): Observable<Campaing> {
    return super.consultarPorId(id).pipe(
      map((res: any) => (Array.isArray(res) ? (res[0] as Campaing) : (res as Campaing)))
    );
  }

  getView(id: number): Observable<Campaing> {
    return super.consultarView(id).pipe(
      map((res: any) => (Array.isArray(res) ? (res[0] as Campaing) : (res as Campaing)))
    );
  }

  create(payload: Partial<Campaing>): Observable<Campaing> {
    return super.save(payload).pipe(map((r: any) => r as Campaing));
  }

  updateById(id: number, payload: Partial<Campaing>): Observable<Campaing> {
    return super.update(payload, id).pipe(map((r: any) => r as Campaing));
  }

  remove(id: number): Observable<void> {
    return super.excluir(id);
  }

  search(term: string): Observable<Campaing[]> {
    return super.filter(term).pipe(map((r: any) => (Array.isArray(r) ? (r as Campaing[]) : (r?.items ?? r?.content ?? []) as Campaing[])));
  }
}

