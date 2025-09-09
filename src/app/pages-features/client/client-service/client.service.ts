import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {Client, SortData} from '../../../models/Client';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from '../../../services/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends AbstractService<Client> {
  constructor(http: HttpClient) {
    super(http, 'client'); // baseUrl da API -> /client
  }

  /** Lista paginada tipada, adaptando diferentes formatos de resposta. */
  listarClientes(
    filtro: any,
    pageNumber: number,
    pageSize: number,
    sortData?: SortData
  ): Observable<{ content: Client[]; total: number }> {
    return super.listar(filtro, pageNumber, pageSize, sortData as any).pipe(
      map((res: any) => {
        if (Array.isArray(res)) {
          return { content: res as Client[], total: res.length };
        }
        if (res?.content) {
          return {
            content: res.content as Client[],
            total: (res.totalElements ?? res.total ?? res.content.length) as number
          };
        }
        if (res?.items) {
          return {
            content: res.items as Client[],
            total: (res.total ?? res.count ?? res.items.length) as number
          };
        }
        return { content: [], total: 0 };
      })
    );
  }

  /** Obtém por ID (tipado). */
  getById(id: number): Observable<Client> {
    return super.consultarPorId(id).pipe(
      map((res: any) => (Array.isArray(res) ? (res[0] as Client) : (res as Client)))
    );
  }

  /** View/DTO específico (se existir no backend). */
  getView(id: number): Observable<Client> {
    return super.consultarView(id).pipe(
      map((res: any) => (Array.isArray(res) ? (res[0] as Client) : (res as Client)))
    );
  }

  /** Cria cliente. */
  create(payload: Partial<Client>): Observable<Client> {
    return super.save(payload).pipe(map((r: any) => r as Client));
  }

  /** Atualiza cliente. */
  updateById(id: number, payload: Partial<Client>): Observable<Client> {
    return super.update(payload, id).pipe(map((r: any) => r as Client));
  }

  /** Exclui cliente. */
  remove(id: number): Observable<void> {
    return super.excluir(id);
  }

  /** Busca simples por termo (usa /search do genérico). */
  search(term: string): Observable<Client[]> {
    return super.filter(term).pipe(map((r: any) => (Array.isArray(r) ? (r as Client[]) : (r?.items ?? r?.content ?? []) as Client[])));
  }
}
