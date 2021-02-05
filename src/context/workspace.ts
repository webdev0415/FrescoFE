import React, { useContext, Context } from 'react';

export const WorkspaceContext: Context<any> = React.createContext({
  organization: null,
});

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}
