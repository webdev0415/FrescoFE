export interface BoardRequestInterface {
  name: string;
  orgId: string;
  categoryId?: string;
  data: string;
  imageId?: string;
  teamId?: string;
}

export interface CollaboratorInterface {
  email: string;
  id: string;
  name: string;
  role: string;
}

export interface BoardInterface extends BoardRequestInterface {
  id: string;
  createdUserId: string;
  path?: string;
  users: CollaboratorInterface[];
}

export interface BoardResponseInterface extends BoardInterface {}
