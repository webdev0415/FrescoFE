import { http } from './http-instance';
import { Observable } from 'rxjs';

export class WorkspaceMembersApiService {
  static getById(orgId: string): any {
    return new Observable(observer => {
      http
        .request<any>({
          url: 'organization/' + orgId + '/members',
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