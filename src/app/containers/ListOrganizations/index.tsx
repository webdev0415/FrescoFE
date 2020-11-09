import React, { Fragment, useEffect } from 'react';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { listOrganizationsSaga } from './saga';
import { selectToken } from 'app/selectors';
import { selectListOrganizations } from './selectors';

export const ListOrganizations = () => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: listOrganizationsSaga });

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

  const gotoOrgDetail = id => {
    history.push(`/organization/${id}`);
  };

  const gotoCreateOrgs = () => {
    history.push(`/create-org`);
  };

  return (
    <Fragment>
      <div
        style={{
          width: '80%',
          margin: 'auto',
          marginTop: '3rem',
        }}
      >
        <Row>
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
        </Row>

        <Row>
          {organizations?.listOrganizations?.map((item, index) => (
            <Col
              key={index}
              xs={6}
              xl={6}
              onClick={() => gotoOrgDetail(item.orgId)}
            >
              <div
                style={{
                  width: '80%',
                  height: '2rem',
                  margin: 'auto',
                  lineHeight: '2rem',
                  textAlign: 'center',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginBottom: '2rem',
                }}
              >
                <p style={{ color: '#000' }}>{item.organizationName}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Fragment>
  );
};
