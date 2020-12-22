import { BoardApiService, BoardInterface, http } from '../';

jest.mock('../http-instance');
describe('BoardApiService', () => {
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
      Promise.reject({
        response: 'Network Error',
      }),
    );
    BoardApiService.create({
      orgId: '',
      imageId: '',
      data: '',
      categoryId: '',
      name: '',
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
      Promise.reject({
        response: 'Network Error',
      }),
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
    BoardApiService.deleteById('', {
      boardId: '',
      orgId: '',
      userId: '',
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

  it('Board deleteById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({
        response: 'Network Error',
      }),
    );
    BoardApiService.deleteById('', {
      boardId: '',
      orgId: '',
      userId: '',
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
      Promise.reject({
        response: 'Network Error',
      }),
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
    BoardApiService.updateById('', {
      name: '',
      categoryId: '',
      data: '',
      imageId: '',
      orgId: '',
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

  it('Board updateById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({
        response: 'Network Error',
      }),
    );
    BoardApiService.updateById('', {
      name: '',
      categoryId: '',
      data: '',
      imageId: '',
      orgId: '',
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
});
