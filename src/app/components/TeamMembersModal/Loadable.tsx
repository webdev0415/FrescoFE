import { lazyLoad } from 'utils/loadable';

export const TeamMembersModal = lazyLoad(
  () => import('./index'),
  module => module.TeamMembersModal,
);
