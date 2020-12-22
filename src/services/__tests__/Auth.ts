import Auth from '../Auth';
import '../../../localStorageMock';

describe('Auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('Auth Update Success', done => {
    localStorage.setItem(
      'authInformation',
      JSON.stringify({
        token: {
          accessToken: 'token',
        },
        user: {
          email: 'string',
          id: 'string',
          name: 'string',
          role: 'string',
        },
      }),
    );
    Auth.update();
    expect(Auth.user).toBeDefined();
    expect(Auth.token).toBeDefined();
    done();
  });

  it('Auth Update Fail', done => {
    localStorage.clear();
    Auth.update();
    expect(Auth.user).toBeNull();
    expect(Auth.token).toBeNull();
    done();
  });
});
