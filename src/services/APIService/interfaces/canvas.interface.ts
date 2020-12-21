export interface CanvasInterface {
  name: string;
  orgId: string;
  data: string;
  categoryId: string;
  imageId?: string;
  createdAt?: string;
  users?: any[];
}

export interface CanvasResponseInterface extends CanvasInterface {
  createdUserId: string;
  id: string;
  path?: string;
}
