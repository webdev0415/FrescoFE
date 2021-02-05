import { http } from './http-instance';
import { Observable } from 'rxjs';
import {
  TeamInterface,
  TeamRequestInterface,
} from './interfaces/Team.interface';

export class TeamsApiService {
  static create(data: TeamRequestInterface): Observable<TeamInterface> {
    return new Observable(observer => {
      http
        .request<any>({
          url: `/teams`,
          data,
          method: 'POST',
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

  static deleteById(teamId: string): Observable<void> {
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

  static getAll(orgId: string): Observable<TeamInterface[]> {
    return new Observable(observer => {
      http
        .request<any>({
          url: `/teams?orgId=${orgId}`,
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

  static getById(teamId: string): Observable<TeamInterface> {
    return new Observable(observer => {
      http
        .request<any>({
          url: `/teams/${teamId}`,
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

  static updateMembers(teamId: string, data: any): Observable<TeamInterface> {
    return new Observable(observer => {
      http
        .request<any>({
          url: `/teams/${teamId}/members`,
          data: {
            users: data.teammembers,
          },
          method: 'PUT',
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
