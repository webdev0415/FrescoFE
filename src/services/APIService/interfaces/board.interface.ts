export interface BoardInterface {
  name: string;
  orgId: string;
  data: string;
  createdUserId: string;
  id?: string;
}

export interface BoardResponseInterface extends BoardInterface {}
