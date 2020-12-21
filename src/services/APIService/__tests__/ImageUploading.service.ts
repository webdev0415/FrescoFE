import { ImageUploadingService, http } from '../';

jest.mock('../http-instance');
describe('ImageUploadingService', () => {
  ImageUploadingService.dataURItoBlob = jest.fn(() => {
    return new Blob([''], { type: 'image/png' });
  });

  it('Image Upload Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    ImageUploadingService.imageUploadFromDataUrl('', '').subscribe(
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

  it('Image Upload Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({
        response: 'Network Error',
      }),
    );
    ImageUploadingService.imageUploadFromDataUrl('', '').subscribe(
      value => {
        throw new Error('Expected no value but got ' + value + ' instead.');
      },
      error => {
        expect(error).toEqual('Network Error');
        done();
      },
    );
  });

  it('Image Update Success', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      }),
    );
    ImageUploadingService.imageUpdateFromDataUrl('', '', '').subscribe(
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

  it('Image Update Fail', done => {
    (http.request as jest.Mock).mockImplementationOnce(() =>
      Promise.reject({
        response: 'Network Error',
      }),
    );
    ImageUploadingService.imageUpdateFromDataUrl('', '', '').subscribe(
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
