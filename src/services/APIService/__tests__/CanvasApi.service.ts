import { CanvasApiService, CanvasResponseInterface, http } from '../';

jest.mock('../http-instance');
describe('CanvasApiService', () => {
  const canvasData: CanvasResponseInterface = {
    name: '',
    users: [],
    categoryId: '',
    data: '',
    imageId: '',
    orgId: '',
    createdAt: '',
    id: '',
    createdUserId: '',
    path: '',
  };
  it('CreateCanvas Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: canvasData,
      }),
    );
    CanvasApiService.create({
      orgId: '',
      imageId: '',
      data: '',
      categoryId: '',
      name: '',
    }).subscribe(
      data => {
        expect(data).toEqual(canvasData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('CreateCanvas Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CanvasApiService.create({
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

  it('Canvas getById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: canvasData,
      }),
    );
    CanvasApiService.getById('').subscribe(
      data => {
        expect(data).toEqual(canvasData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('Canvas getById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CanvasApiService.getById('').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Canvas getByOrganizationId Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: [canvasData],
      }),
    );
    CanvasApiService.getByOrganizationId('').subscribe(
      data => {
        expect(data).toEqual([canvasData]);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('Canvas getByOrganizationId Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CanvasApiService.getByOrganizationId('').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Canvas updateById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: canvasData,
      }),
    );
    CanvasApiService.updateById('', canvasData).subscribe(
      data => {
        expect(data).toEqual(canvasData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('Canvas updateById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CanvasApiService.updateById('', canvasData).subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Canvas deleteById Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: canvasData,
      }),
    );
    CanvasApiService.deleteById('', '').subscribe(
      data => {
        expect(data).toEqual(canvasData);
        done();
      },
      error => {
        console.error(error);
        throw error;
      },
    );
  });

  it('Canvas deleteById Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('Network Error'),
    );
    CanvasApiService.deleteById('', '').subscribe(
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
