import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ViaCep} from '../models/via-cep';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  apiUrl: string = 'https://viacep.com.br/ws/';

  private _http = inject(HttpClient);

  getEndereco(cep: string) {
    return this._http.get<ViaCep>(this.apiUrl + cep + '/json').pipe(
      map((response) => {
        return response;
      })
    )
  }
}
