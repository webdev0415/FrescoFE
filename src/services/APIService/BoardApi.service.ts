import { BehaviorSubject, Observable } from 'rxjs';
import { BoardInterface, BoardRequestInterface } from './interfaces';
import { http } from './http-instance';

export class BoardApiService {
  public static subject: BehaviorSubject<BoardInterface> = new BehaviorSubject<
    BoardInterface
  >({
    id: '',
    createdUserId: '',
    name: '',
    orgId: '',
    data: '',
    teamId: '',
    users: [],
  });
  public static state: Observable<
    BoardInterface
  > = BoardApiService.subject.asObservable();

  static create(data: BoardRequestInterface): Observable<BoardInterface> {
    return new Observable<BoardInterface>(observer => {
      http
        .request<BoardInterface>({
          url: '/board',
          method: 'POST',
          data,
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

  static getById(id: string): Observable<BoardInterface> {
    return new Observable<BoardInterface>(observer => {
      http
        .request<BoardInterface>({
          url: '/board/' + id,
          method: 'GET',
        })
        .then(response => {
          observer.next(response.data);
          BoardApiService.subject.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error.response);
        });
    });
  }

  static deleteById(
    id: string,
    data: {
      boardId: string;
      orgId: string;
      userId: string;
    },
  ): Observable<BoardInterface> {
    return new Observable<BoardInterface>(observer => {
      http
        .request<BoardInterface>({
          url: '/board/' + id,
          method: 'DELETE',
          data: data,
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

  static getByOrganizationId(orgId: string): Observable<BoardInterface[]> {
    return new Observable<BoardInterface[]>(observer => {
      http
        .request<BoardInterface[]>({
          url: '/board/organization/' + orgId,
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

  static updateById(
    id: string,
    data: BoardRequestInterface,
  ): Observable<BoardInterface[]> {
    return new Observable<BoardInterface[]>(observer => {
      http
        .request<BoardInterface[]>({
          url: '/board/' + id,
          method: 'PUT',
          data: data,
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
