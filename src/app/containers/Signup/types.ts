/* --- STATE --- */
export interface SignupState {
  loading: boolean;
  token: string | null;
}

export type ContainerState = SignupState;
