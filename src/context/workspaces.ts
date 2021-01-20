import React, { useContext, Context } from 'react';

export const WorkspacesContext: Context<any> = React.createContext([]);

export function useWorkspacesContext() {
  return useContext(WorkspacesContext);
}
