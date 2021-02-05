import React, { Fragment, useEffect, useState } from 'react';
import { Table, Button, Divider, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.less';
import { WorkspaceMembersApiService } from '../../../services/APIService/WorkspaceMembersApi.service';
import { useWorkspaceContext } from 'context/workspace';
import { selectToken } from 'app/selectors';
import { InviteMemberModal } from '../../components/InviteMemberModal/Loadable';
import { selectDashboard } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSION } from '../Dashboard';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';

const { Option } = Select;

interface DataType {
  key: React.Key;
  name: string;
  role: string;
  email: string;
  lastaccess: string;
}

export const MembersPage = () => {
  const [members, setMembers] = React.useState<any[]>([]);
  const [selectedRowKeys, setSelectRowKeys] = React.useState<string[]>([]);

  const token = useSelector(selectToken);
  const { organization } = useWorkspaceContext();
  const orgId = organization.orgId;
  const [isShowInvitationModal, setIsShowInvitationModal] = useState(false);
  const dashboard = useSelector(selectDashboard);
  const dispatch = useDispatch();
  const history = useHistory();
  const [permission, setPermission] = useState(PERMISSION.EDITOR);
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (token && orgId) {
      WorkspaceMembersApiService.getById(orgId).subscribe(
        result => {
          const workspaceMembers = result.map(member => {
            return {
              ...member,
              name: member.firstName + ' ' + member.lastName,
            };
          });
          setMembers(workspaceMembers);
        },
        error => {
          console.error(error);
        },
      );
    }
  }, [orgId, token]);
  const onSelectChange = selectedRowKeys => {
    setSelectRowKeys(selectedRowKeys);
  };

  const showInviteModal = () => {
    setIsShowInvitationModal(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChange = value => {
    console.log(`selected ${value}`);
  };

  const handleSearch = (value: string) => {
    dispatch(
      actions.searchEmailRequest({ data: { email: value, orgId }, token }),
    );
  };
  const _handleSelectEmail = value => {
    setEmail(value);
  };
  const _handleChangePermission = value => {
    setPermission(value);
  };
  const _handleInvitation = () => {
    const itemEmail = dashboard.listEmail?.filter(item => item.email === email);
    if (itemEmail.length) {
      dispatch(
        actions.invitationRequest({
          data: itemEmail,
          permission,
          token,
          history,
          orgId,
        }),
      );
    } else {
      dispatch(
        actions.invitationRequest({
          data: { email },
          permission,
          token,
          history,
          orgId,
        }),
      );
    }
  };
  const columns = [
    {
      key: '1',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: '2',
      title: 'Role',
      dataIndex: 'permission',
      render: text => (
        <>
          <Select
            defaultValue={text}
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="admin">Admin</Option>
            <Option value="owner">Owner</Option>
            <Option value="user">User</Option>
          </Select>
        </>
      ),
    },
    {
      key: '3',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: '4',
      title: 'Last Access',
      dataIndex: 'lastaccess',
    },
  ];

  // const data: DataType[] = [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     role: 'admin',
  //     email: 'john@gmail.com',
  //     lastaccess: '1 hour ago',
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     role: 'owner',
  //     email: 'jim@gmail.com',
  //     lastaccess: '2 hour ago',
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     role: 'admin',
  //     email: 'joe@gmail.com',
  //     lastaccess: '3 hour ago',
  //   },
  //   {
  //     key: '4',
  //     name: 'John Doe',
  //     role: 'user',
  //     email: 'johndoe@gmail.com',
  //     lastaccess: '4 hour ago',
  //   },
  // ];

  return (
    <Fragment>
      <p style={{ marginBottom: 40 }}>Manage members on your workspace</p>

      <div className="members-description">
        <div style={{ textAlign: 'center', marginRight: 25 }}>
          <p>1</p>
          <Divider className="divider-border-color" />
          <p>Active</p>
        </div>
        <div style={{ textAlign: 'center', marginRight: 25 }}>
          <p>1</p>
          <Divider className="divider-border-color" />
          <p>Pending</p>
        </div>
        <div style={{ textAlign: 'center', marginRight: 25 }}>
          <p>1</p>
          <Divider className="divider-border-color" />
          <p>Remaining Seats</p>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showInviteModal}
        >
          Add Member
        </Button>
      </div>

      <div>
        <Table
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={members}
        />
      </div>
      {isShowInvitationModal && (
        <InviteMemberModal
          onCancel={() => setIsShowInvitationModal(false)}
          handleInvitation={_handleInvitation}
          listEmail={dashboard.listEmail}
          email={email}
          loading={dashboard.loading}
          handleSearch={handleSearch}
          handleSelectEmail={_handleSelectEmail}
          handleChangePermission={_handleChangePermission}
        />
      )}
    </Fragment>
  );
};
