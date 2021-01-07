import { lazyLoad } from 'utils/loadable';

export const InviteMemberModal = lazyLoad(
  () => import('./index'),
  module => module.InviteMemberModal,
);
