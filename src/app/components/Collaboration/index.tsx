import React, { memo, Fragment, useEffect, useState } from 'react';

interface Props {
  users: any[] | undefined;
}

export const Collaboration = memo((props: Props) => {
  /* istanbul ignore next */
  const users = props?.users?.map(item => {
    return item.email;
  });

  return (
    <Fragment>
      <span className="user-title" role="users">
        {users?.join(' + ') || ''}
      </span>
    </Fragment>
  );
});
