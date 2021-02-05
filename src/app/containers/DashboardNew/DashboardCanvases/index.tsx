/**
 *
 * Dashboard
 *
 */
import React, { memo, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, Select, Skeleton, Tabs } from 'antd';
import { LoadingOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Collaboration } from '../../../components/Collaboration';
import {
  CanvasApiService,
  CanvasCategoryInterface,
  CanvasCategoryService,
  CanvasResponseInterface,
} from '../../../../services/APIService';

export const PERMISSION = {
  EDITOR: 'edit',
  VIEW: 'view',
};

interface Props {
  match?: any;
  location?: any;
  history: {
    push(url: string, arg: any): void;
  };
  orgId: string;
}

export const DashboardCanvases = memo((props: Props) => {
  const [isShowAddNewCanvas, setIsShowAddNewCanvas] = useState(false);
  const [canvasName, setCanvasName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loadingCategoriesList, setLoadingCategoriesList] = useState(false);
  const [loadingCreateCanvas, setLoadingCreateCanvas] = useState(false);
  const [categories, setCategories] = useState<CanvasCategoryInterface[]>([]);
  const [canvasList, setCanvasList] = useState<CanvasResponseInterface[]>([]);
  const [loadingCanvasList, setLoadingCanvasList] = useState(false);
  const [editCanvasItem, setEditCanvasItem] = useState('');
  const [loadingUpdateName, setLoadingUpdateName] = useState(false);
  const [hoveredBoard, setHoveredBoard] = useState('');
  const [editName, setEditName] = useState('');

  const { history, orgId } = props;

  const getCanvasList = React.useCallback(() => {
    setLoadingCanvasList(true);
    CanvasApiService.getByOrganizationId(orgId).subscribe(
      data => {
        setCanvasList(data);
        setLoadingCanvasList(false);
      },
      () => {
        setLoadingCanvasList(false);
      },
    );
  }, [orgId]);

  useEffect(() => {
    getCanvasList();
    console.log(orgId, 'params');
  }, [getCanvasList, orgId]);

  const handleClickRename = (id: string) => {
    setEditCanvasItem(id);
  };

  const handleChangeName = (event: any) => {
    setEditName(event.target.value);
  };

  const onSaveName = () => {
    const id = editCanvasItem;
    const name = editName;
    const item = canvasList.find(i => i.id === id);
    if (item) {
      setLoadingUpdateName(true);
      const data = {
        ...item,
        name: name,
      };
      CanvasApiService.updateById(id, data).subscribe(
        () => {
          setLoadingUpdateName(false);
          setEditName('');
          setEditCanvasItem('');
          getCanvasList();
        },
        error => {
          setLoadingUpdateName(false);
          console.error(error);
        },
      );
    }
  };

  const handleDeleteCanvas = (id: string) => {
    CanvasApiService.deleteById(id, orgId).subscribe(
      data => {
        console.log(data);
        setCanvasList(canvasList.filter(item => item.id !== id));
      },
      error => {
        console.error(error);
      },
    );
  };

  const getCategoriesList = () => {
    setLoadingCategoriesList(true);
    CanvasCategoryService.list().subscribe(
      data => {
        setCategories(data);
        setLoadingCategoriesList(false);
      },
      () => {
        setLoadingCategoriesList(false);
      },
    );
  };

  useEffect(() => {
    getCategoriesList();
  }, [orgId]);

  const createCanvas = React.useCallback(() => {
    setLoadingCreateCanvas(true);
    const data = {
      name: canvasName,
      orgId: orgId,
      data: '',
      categoryId: categoryId,
    };

    CanvasApiService.create(data).subscribe(
      data => {
        setLoadingCreateCanvas(false);
        history.push(`/canvas/${data.id}?organization=${orgId}`, { orgId });
      },
      error => {
        setLoadingCreateCanvas(false);
        console.error(error.response);
      },
    );
  }, [canvasName, history, orgId, categoryId]);

  return (
    <div className="card-section">
      <Button
        hidden={isShowAddNewCanvas}
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsShowAddNewCanvas(true);
          setCanvasName('');
        }}
      >
        Create Canvas
      </Button>

      <div
        hidden={!isShowAddNewCanvas}
        style={{
          display: 'inline-flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '20px',
        }}
      >
        <Input
          placeholder="Name"
          name="name"
          onChange={event => setCanvasName(event.currentTarget.value)}
          style={{ width: 300, flexShrink: 0 }}
        />
        <Select
          defaultValue=""
          style={{ width: 220, flexShrink: 0 }}
          onChange={value => {
            setCategoryId(value);
          }}
          loading={loadingCategoriesList}
          allowClear
        >
          <Select.Option value="" disabled>
            Category
          </Select.Option>
          {categories.map(item => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={createCanvas}
          disabled={!categoryId || !canvasName}
          loading={loadingCreateCanvas}
        >
          Create Canvas
        </Button>
      </div>
      <h3 className="card-section-title">Custom Canvas</h3>
      <div className="card-grid">
        {!loadingCanvasList && !canvasList.length && (
          <h3
            style={{
              width: '100%',
              color: 'red',
              textAlign: 'center',
            }}
          >
            No Canvases
          </h3>
        )}
        {canvasList.map((data, index) => (
          <div
            className={`cards-board ${
              hoveredBoard === data.id ? 'active' : ''
            }`}
            key={index}
            onMouseEnter={() => {
              setHoveredBoard(data.id);
            }}
            onMouseLeave={() => {
              setHoveredBoard('');
            }}
          >
            <Link
              to={{
                pathname: `/canvas/${data.id}?organization=${orgId}`,
                state: { orgId },
              }}
            >
              <img
                alt="example"
                style={{
                  border: '1px solid #f0f2f5',
                  backgroundColor: 'white',
                }}
                src={
                  data.path ||
                  'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                }
              />
            </Link>
            <div className="card-footer">
              <div className="card-action">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <Link
                          to={{
                            pathname: `/canvas/${data.id}?organization=${orgId}`,
                            state: { orgId },
                          }}
                        >
                          Edit
                        </Link>
                      </Menu.Item>
                      <Menu.Item
                        key="1"
                        onClick={() => handleClickRename(data.id)}
                      >
                        Rename
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        key="3"
                        onClick={() => handleDeleteCanvas(data.id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <div className="action-button">
                    <span className="material-icons">more_vert</span>
                  </div>
                </Dropdown>
              </div>
              {editCanvasItem !== data.id && (
                <div className="card-title">
                  {data.name}
                  {data && data.name && data.name.length >= 34 ? (
                    <span className="tooltip">{data.name}</span>
                  ) : (
                    ''
                  )}
                </div>
              )}
              {editCanvasItem === data.id && (
                <div className="card-title-input">
                  <Input
                    addonAfter={
                      <>
                        {!loadingUpdateName && (
                          <SaveOutlined
                            onClick={onSaveName}
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                        {loadingUpdateName && <LoadingOutlined />}
                      </>
                    }
                    defaultValue={data.name}
                    onChange={handleChangeName}
                  />
                </div>
              )}
              <div className="card-timestamp">
                {data && data.createdAt
                  ? moment(data.createdAt).format('LLL')
                  : ''}
              </div>
              <div className="card-users">
                <span className="material-icons">group</span>
                <Collaboration users={data.users} />
              </div>
            </div>
          </div>
        ))}
        {loadingCanvasList &&
          Array(5)
            .fill(1)
            .map((item, index) => (
              <div className="cards-board" key={item + index}>
                <Skeleton.Image />

                <div className="card-footer">
                  <Skeleton
                    active
                    paragraph={{
                      rows: 0,
                      style: { display: 'none' },
                    }}
                    title={{ width: '100%', style: { marginTop: 0 } }}
                    className="card-title"
                  />
                  <Skeleton
                    active
                    paragraph={{
                      rows: 0,
                      style: { display: 'none' },
                    }}
                    title={{ width: '100%', style: { marginTop: 0 } }}
                    className="card-timestamp"
                  />

                  <Skeleton
                    active
                    paragraph={{
                      rows: 0,
                      style: { display: 'none' },
                    }}
                    title={{ width: '100%', style: { marginTop: 0 } }}
                    className="card-users"
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
});
