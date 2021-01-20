const routes: any = {
  // -------- Authorized routes start -------- //
  home: {
    path: '/',
    exact: true,
  },
  dashboard: {
    path: '/organization/:orgId',
    exact: true,
  },
  createCanvas: {
    path: '/create-canvas',
    exact: true,
  },
  board: {
    path: '/board/:id',
    exact: true,
  },
  canvas: {
    path: '/canvas/:id',
    exact: true,
  },
  verifyInvitationToken: {
    path: '/invitation/check/:token',
    exact: true,
  },
  verifyInvitationType: {
    path: '/invitation-type/verification/:token',
    exact: true,
  },
  selectOrganization: {
    path: '/create-org',
    exact: true,
  },
  workspaceSettings: {
    path: '/organization/:orgId/settings',
    exact: true,
  },
  workspaceSettingsMembers: {
    path: '/organization/:orgId/settings/members',
    exact: true,
  },
  workspaceSettingsTeams: {
    path: '/organization/:orgId/settings/teams',
    exact: true,
  },
  workspaceSettingsBillings: {
    path: '/organization/:orgId/settings/billings',
    exact: true,
  },

  // -------- Authorized routes end -------- //
  // -------- Guest routes start -------- //

  // -------- Guest routes end -------- //
};

export default routes;
