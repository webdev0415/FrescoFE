import { CanvasCategoryService, http } from '../';

jest.mock('../http-instance');
describe('CanvasCategoryService', () => {
  it('List Categories Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: [],
      }),
    );
    CanvasCategoryService.list().subscribe(
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

  it('List Categories Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({
        response: 'Network Error',
      }),
    );
    CanvasCategoryService.list().subscribe(
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
