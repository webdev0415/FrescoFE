/* --- STATE --- */
export interface UserType {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  // TODO: define enum for roles
  role: string;
  avatar?: string;
}

export interface GlobalState {
  token: string | null;
  user: null | UserType;
}

export type ContainerState = GlobalState;
