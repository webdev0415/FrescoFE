import { httpRequestInterceptor } from '../';
import Auth from '../../Auth';

describe('CanvasCategoryService', () => {
  it('List Categories Success', done => {
    Object.setPrototypeOf(Auth, {
      getToken: jest.fn(() => {
        return 'token';
      }),
    });
    const config = httpRequestInterceptor({
      headers: {},
    });
    expect(config).toEqual({
      headers: {
        Authorization: 'Bearer token',
      },
    });
    done();
  });

  it('List Categories Fail', done => {
    Object.setPrototypeOf(Auth, {
      getToken: jest.fn(() => {
        return null;
      }),
    });
    const config = httpRequestInterceptor({
      headers: {},
    });
    expect(config).toEqual({
      headers: {},
    });
    done();
  });
});
