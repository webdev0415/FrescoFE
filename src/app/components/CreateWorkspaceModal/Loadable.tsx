import { lazyLoad } from 'utils/loadable';

export const CreateWorkspaceModal = lazyLoad(
  () => import('./index'),
  module => module.CreateWorkspaceModal,
);
