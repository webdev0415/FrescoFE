import { MessagesApiService, http } from '../';

jest.mock('../http-instance');
describe('MessagesApiService', () => {
  it('MessagesApiService AllMessages Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    MessagesApiService.AllMessages('', '', '').subscribe(
      data => {
        expect(data).toBeDefined();
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('MessagesApiService AllMessages Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({ data: 'Network Error' }),
    );
    MessagesApiService.AllMessages('', '', '').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('MessagesApiService postMessage Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    MessagesApiService.postMessage('', '').subscribe(
      data => {
        expect(data).toBeDefined();
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('MessagesApiService postMessage Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({ data: 'Network Error' }),
    );
    MessagesApiService.postMessage('', '').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('MessagesApiService deleteMessage Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    MessagesApiService.deleteMessage('').subscribe(
      data => {
        expect(data).toBeDefined();
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('MessagesApiService deleteMessage Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({ data: 'Network Error' }),
    );
    MessagesApiService.deleteMessage('').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('MessagesApiService editMessage Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    MessagesApiService.editMessage('', '', '').subscribe(
      data => {
        expect(data).toBeDefined();
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('MessagesApiService editMessage Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({ data: 'Network Error' }),
    );
    MessagesApiService.editMessage('', '', '').subscribe(
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
