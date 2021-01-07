/**
 *
 * Asynchronously loads the component for ShareModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateTeamModal = lazyLoad(
  () => import('./index'),
  module => module.CreateTeamModal,
);
