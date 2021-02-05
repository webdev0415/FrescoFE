/**
 *
 * Dashboard
 *
 */
import React, { memo, useState } from 'react';
import { Button } from 'antd';
import { CanvasBoardTemplates } from '../../../components/CanvasBoardTemplates';
import { PlusOutlined } from '@ant-design/icons';
import { BoardList } from '../../BoardList';

interface Props {
  match?: any;
  location?: any;
  orgId: string;
  organization: any;
}

export const DashboardBoards = memo((props: Props) => {
  const { organization } = props;
  const [showAddNewBoard, setAddNewBoard] = useState(false);

  return showAddNewBoard ? (
    <CanvasBoardTemplates
      orgId={props.orgId}
      onClose={() => setAddNewBoard(false)}
    />
  ) : (
    <div className="card-section">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setAddNewBoard(true)}
      >
        New Board
      </Button>
      <h3 className="dashboard__tab-title">My Boards</h3>
      {organization && <BoardList orgId={organization.orgId} />}
    </div>
  );
});
