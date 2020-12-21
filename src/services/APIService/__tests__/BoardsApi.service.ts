import { BoardInterface, http } from '../';
import { BoardApiService } from '../BoardsApi.service';

jest.mock('../http-instance');

describe('BoardsApiService', () => {
  const boardData: BoardInterface = {
    name: '',
    users: [],
    categoryId: '',
    createdUserId: '',
    data: '',
    id: '',
    imageId: '',
    orgId: '',
    path: '',
  };
  it('CreateBoard Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: boardData,
      }),
    );
    BoardApiService.create({
      orgId: '',
      imageId: '',
      data: '',
      categoryId: '',
      name: '',
      path: '',
      id: '',
      createdUserId: '',
      users: [],
    }).subscribe(
      data => {
        expect(data).toEqual(boardData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('CreateBoard Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    BoardApiService.create({
      orgId: '',
      imageId: '',
      data: '',
      categoryId: '',
      name: '',
      path: '',
      id: '',
      createdUserId: '',
      users: [],
    }).subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Board getById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: boardData,
      }),
    );
    BoardApiService.getById('').subscribe(
      data => {
        expect(data).toEqual(boardData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('Board getById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    BoardApiService.getById('').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Board deleteById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: boardData,
      }),
    );
    BoardApiService.deleteById('', '').subscribe(
      data => {
        expect(data).toEqual(boardData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('Board deleteById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    BoardApiService.deleteById('', '').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Board getByOrganizationId Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: boardData,
      }),
    );
    BoardApiService.getByOrganizationId('').subscribe(
      data => {
        expect(data).toEqual(boardData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('Board getByOrganizationId Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    BoardApiService.getByOrganizationId('').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Board updateById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: boardData,
      }),
    );
    BoardApiService.updateById('', boardData).subscribe(
      data => {
        expect(data).toEqual(boardData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('Board updateById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    BoardApiService.updateById('', boardData).subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });
});
