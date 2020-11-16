export interface BoardRequestInterface {
  name: string;
  orgId: string;
  data: string;
  imageId?: string;
}

export interface BoardInterface extends BoardRequestInterface {
  id: string;
  categoryId: string;
  createdUserId: string;
  path: string;
}
