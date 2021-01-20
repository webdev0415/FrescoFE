import { http } from './http-instance';
import { Observable } from 'rxjs';
import { OrganizationInterface } from './interfaces';

export class OrganizationApiService {
  static getById(id: string): Observable<OrganizationInterface> {
    return new Observable<OrganizationInterface>(observer => {
      http
        .request<OrganizationInterface>({
          url: '/organization/' + id,
          method: 'GET',
        })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error.response);
        });
    });
  }
}
