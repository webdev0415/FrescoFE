import { http } from './http-instance';
import { Observable } from 'rxjs';

export class TeamsApiService {
  static getById(teamId: string): any {
    return new Observable(observer => {
      http
        .request<any>({
          url: `/teams/${teamId}`,
          method: 'DELETE',
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
