import React, { Fragment, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';
import './listOgranizations.less';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { listOrganizationsSaga } from './saga';
import { selectToken } from 'app/selectors';
import { selectListOrganizations } from './selectors';
import { UserInfoModal } from '../../components/UserInfoModal';
import { actions as globalActions } from '../../slice';

export const ListOrganizations = () => {
  const [isShowUserModal, setIsShowUserModal] = useState(false);
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: listOrganizationsSaga });
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  const organizations = useSelector(selectListOrganizations);

  useEffect(() => {
    if (token && history) {
      dispatch(
        actions.listOrganizationsRequest({
          token,
          history,
        }),
      );
    }
  }, [dispatch, history, token]);

  useEffect(() => {
    let lastOrgId = organizations.listOrganizations[0]?.orgId;
    if (lastOrgId) {
      history.push(`/organization/${lastOrgId}`);
      setLoading(false);
    }
  }, [history, organizations]);

  useEffect(() => {
    const profileIcon = document.getElementById(
      'profile-icon',
    ) as HTMLDivElement;
    if (profileIcon) {
      profileIcon.addEventListener('click', () => {
        setIsShowUserModal(true);
      });

      document.addEventListener('click', event => {
        const accountModal = document.getElementById('account-modal');
        if (accountModal) {
          if (
            !(
              accountModal.contains(event.target as Node) ||
              profileIcon.contains(event.target as Node)
            )
          ) {
            setIsShowUserModal(false);
          }
        }
      });
    }
  }, []);

  const gotoOrgDetail = id => {
    history.push(`/organization/${id}`);
  };

  const gotoCreateOrgs = () => {
    history.push(`/create-org`);
  };
  const handleLogOut = () => {
    dispatch(globalActions.removeAuth());
    localStorage.clear();
    history.push('/auth/login');
  };

  return (
    <Fragment>
      {isShowUserModal && <UserInfoModal logOut={() => handleLogOut()} />}
      <div
        style={{
          width: '80%',
          margin: 'auto',
          marginTop: '3rem',
        }}
      >
        {/* <Row>
          <div>
            <p style={{ color: '#000', fontSize: '2rem', fontWeight: 'bold' }}>
              Organizations
            </p>
          </div>

          <PlusCircleOutlined
            style={{
              color: '#000',
              fontSize: '2rem',
              margin: '0.5rem 0 0 1rem',
            }}
            onClick={() => gotoCreateOrgs()}
          />
        </Row> */}

        <div className={`lds-ellipsis-loading`}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </Fragment>
  );
};
