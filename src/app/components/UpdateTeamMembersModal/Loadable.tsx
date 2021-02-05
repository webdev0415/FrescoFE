import { lazyLoad } from 'utils/loadable';

export const UpdateTeamMembersModal = lazyLoad(
  () => import('./index'),
  module => module.UpdateTeamMembersModal,
);
