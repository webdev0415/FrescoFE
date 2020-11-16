export interface BoardRequestInterface {
  name: string;
  orgId: string;
  data: string;
}

export interface BoardInterface extends BoardRequestInterface {
  id: string;
  categoryId: string;
  createdUserId: string;
}

export interface BoardResponseInterface extends BoardInterface {}
