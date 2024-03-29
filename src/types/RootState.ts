// Types
import { SignupState } from 'app/containers/Signup/types';
import { SignInState } from 'app/containers/SignIn/types';
import { GlobalState } from 'app/types';
import { DashboardState } from 'app/containers/Dashboard/types';
import { EmailConfirmationState } from 'app/containers/EmailConfirmation/types';
import { CheckEmailViewState } from 'app/containers/CheckEmailView/types';
import { WelcomePageState } from 'app/containers/WelcomePage/types';
import { SelectOrganizationPageState } from 'app/containers/SelectOrganizationPage/types';
import { VerifyInvitationState } from 'app/containers/VerifyInvitation/types';
import { ListOrganizationsState } from 'app/containers/ListOrganizations/types';
import { SignupForInvitationState } from 'app/containers/SignupForInvitation/types';
import { BoardListState } from 'app/containers/BoardList/types';
import { VerifyInvitationTypeState } from 'app/containers/VerifyInvitationType/types';
import { ShareModalState } from 'app/components/ShareModal/types';
import { CreateTeamModalState } from 'app/components/CreateTeamModal/types';
import { MyProfileModalState } from 'app/components/MyProfileModal/types';
import { CreateWorkspaceModalState } from 'app/components/CreateWorkspaceModal/types';
import { TeamMenuState } from 'app/containers/Dashboard/TeamMenu/types';
// import { WorkspaceMembersState } from 'app/containers/MembersPage/types';
import { WorkspacePageState } from 'app/containers/WorkspacePage/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

export interface RootState {
  global?: GlobalState;
  signup?: SignupState;
  signIn?: SignInState;
  dashboard?: DashboardState;
  emailConfirmation?: EmailConfirmationState;
  checkEmailView?: CheckEmailViewState;
  welcomePage?: WelcomePageState;
  selectOrganizationPage?: SelectOrganizationPageState;
  verifyInvitation?: VerifyInvitationState;
  listOrganizations?: ListOrganizationsState;
  signupForInvitation?: SignupForInvitationState;
  boardList?: BoardListState;
  verifyInvitationType?: VerifyInvitationTypeState;
  shareModal?: ShareModalState;
  createTeam?: CreateTeamModalState;
  myProfile?: MyProfileModalState;
  createWorkspace?: CreateWorkspaceModalState;
  teamMenu?: TeamMenuState;
  // workspaceMembers?: TeamMenuState;
  workspacepage?: WorkspacePageState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
