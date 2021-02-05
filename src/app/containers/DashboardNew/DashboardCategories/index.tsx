/**
 *
 * Dashboard
 *
 */
import React, { memo, useRef, useState } from 'react';
import { Button, Tabs } from 'antd';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import { Categories } from '../../Categories';
import { UserType } from '../../../types';
// Components

export const PERMISSION = {
  EDITOR: 'editor',
  VIEW: 'view',
};

interface Props {
  match?: any;
  location?: any;
}

export const DashboardCategories = memo((props: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="card-section">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        New Category
      </Button>
      <h3 className="dashboard__tab-title">Categories</h3>
      <Categories
        visible={isModalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
});
