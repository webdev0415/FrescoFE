import { CategoriesApiService, http } from '../';

jest.mock('../http-instance');
describe('CategoriesApiService', () => {
  it('Categories Create Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    CategoriesApiService.create({
      name: '',
    }).subscribe(
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

  it('Categories Create Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CategoriesApiService.create({
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

  it('Categories getById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    CategoriesApiService.getById('').subscribe(
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

  it('Categories getById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CategoriesApiService.getById('').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Categories getAllCategories Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: [],
      }),
    );
    CategoriesApiService.getAllCategories().subscribe(
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

  it('Categories getAllCategories Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CategoriesApiService.getAllCategories().subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Categories updateById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    CategoriesApiService.updateById('', {
      name: '',
    }).subscribe(
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

  it('Categories updateById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CategoriesApiService.updateById('', {
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

  it('Categories deleteById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    CategoriesApiService.deleteById('').subscribe(
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

  it('Categories deleteById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CategoriesApiService.deleteById('').subscribe(
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
