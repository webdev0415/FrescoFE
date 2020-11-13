import { ImageUploadResponseInterface } from './interfaces';
import { Observable } from 'rxjs';
import { http } from './http-instance';

export class ImageUploadingService {
  static imageUploadFromDataUrl(
    dataURI: string,
    type: string,
  ): Observable<ImageUploadResponseInterface> {
    return new Observable<ImageUploadResponseInterface>(observer => {
      const imageFile = ImageUploadingService.dataURItoBlob(dataURI);
      const image = new File([imageFile], 'image.png', {
        lastModified: new Date().getTime(),
        type: imageFile.type,
      });
      const formData = new FormData();
      formData.append('file', image);
      http
        .request<ImageUploadResponseInterface>({
          method: 'POST',
          data: formData,
          url: '/upload/image/' + type,
        })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  static dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const dw = new DataView(ab);
    for (let i = 0; i < byteString.length; i++) {
      dw.setUint8(i, byteString.charCodeAt(i));
    }
    return new Blob([ab], { type: mimeString });
  }
}
