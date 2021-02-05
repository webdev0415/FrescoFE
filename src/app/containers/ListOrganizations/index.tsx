import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { OrganizationsApiService } from '../../../services/APIService/OrganizationsApi.service';

export const ListOrganizations = () => {
  const history = useHistory();

  useEffect(() => {
    OrganizationsApiService.list().subscribe(
      result => {
        if (result.length) {
          history.push('/organization/' + result[0].orgId);
        } else {
          history.push('/auth/welcome-page');
        }
      },
      error => {
        history.push('/auth/welcome-page');
      },
    );
  }, [history]);

  return <Fragment />;
};
