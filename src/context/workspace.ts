import React, { useContext, Context } from 'react';

export const WorkspaceContext: Context<any> = React.createContext(null);

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}
