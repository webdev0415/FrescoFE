export interface TeamRequestInterface {
  name: string;
  users?: string[];
}

export interface TeamMemberInterface {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface TeamInterface {
  id: string;
  name: string;
  orgId: string;
  isDefault: boolean;
  createdAt: string;
  users?: TeamMemberInterface[];
}

export interface TeamResponseInterface extends TeamInterface {}
