/**
 *
 * Asynchronously loads the component for WelcomePage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WorkspaceSettings = lazyLoad(
  () => import('./index'),
  module => module.WorkspaceSettings,
);
