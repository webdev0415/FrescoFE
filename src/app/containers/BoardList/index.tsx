import { Dropdown, Input, Menu, Skeleton } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { boardListSaga } from './saga';
import { actions, reducer, sliceKey } from './slice';
import { selectBoardList } from './selectors';
import { Link } from 'react-router-dom';
import { BoardApiService } from 'services/APIService/BoardsApi.service';
import { Collaboration } from '../../components/Collaboration';
import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import clsx from 'clsx';

interface BoardListProps {
  orgId: string;
}

export const BoardList = (props: BoardListProps) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: boardListSaga });
  const [editBoardItem, setEditBoardItem] = useState('');
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleBoardMenu, setVisibleBoardMenu] = useState('');
  const [hoveredBoard, setHoveredBoard] = useState('');

  const boardList = useSelector(selectBoardList);
  const dispatch = useDispatch();

  const getBoards = React.useCallback(() => {
    dispatch(actions.attemptGetBoards(props.orgId));
  }, [dispatch, props.orgId]);

  React.useEffect(() => {
    getBoards();
  }, [getBoards]);

  const handleDeleteBoard = (id: string) => {
    BoardApiService.deleteById(id, props.orgId).subscribe(
      data => {
        console.log(data);
        dispatch(actions.deleteBoard(id));
      },
      error => {
        console.error(error);
      },
    );
  };

  const handleClickRename = (id: string) => {
    setEditBoardItem(id);
  };

  const handleChangeName = (event: any) => {
    setEditName(event.target.value);
  };
  const onSaveName = () => {
    const id = editBoardItem;
    const name = editName;
    const item = boardList.boardList.find(i => i.id === id);
    if (item) {
      setLoading(true);
      const data = {
        ...item,
        name: name,
      };

      BoardApiService.updateById(id, data).subscribe(
        () => {
          setLoading(false);
          setEditName('');
          setEditBoardItem('');
          getBoards();
        },
        error => {
          setLoading(false);
          console.error(error);
        },
      );
    }
  };

  return (
    <div className="card-grid">
      {boardList.loading &&
        !boardList.boardList.length &&
        Array(5)
          .fill(1)
          .map((item, index) => (
            <div className="cards-board" key={item + index}>
              <Skeleton.Image />

              <div className="card-footer">
                <Skeleton
                  active
                  paragraph={{ rows: 0, style: { display: 'none' } }}
                  title={{ width: '100%', style: { marginTop: 0 } }}
                  className="card-title"
                />
                <Skeleton
                  active
                  paragraph={{ rows: 0, style: { display: 'none' } }}
                  title={{ width: '100%', style: { marginTop: 0 } }}
                  className="card-timestamp"
                />

                <Skeleton
                  active
                  paragraph={{ rows: 0, style: { display: 'none' } }}
                  title={{ width: '100%', style: { marginTop: 0 } }}
                  className="card-users"
                />
              </div>
            </div>
          ))}
      {boardList.boardList.length && !boardList.loading
        ? boardList.boardList.map((item, index) => (
            <div
              className={clsx('cards-board', {
                active:
                  hoveredBoard === item.id || visibleBoardMenu === item.id,
              })}
              key={index}
              onMouseEnter={() => {
                setHoveredBoard(item.id);
              }}
              onMouseLeave={() => {
                setHoveredBoard('');
              }}
            >
              <Link
                to={{
                  pathname: `/board/${item.id}`,
                  state: { orgId: props.orgId },
                }}
              >
                <img
                  alt="example"
                  src={
                    item.path ||
                    'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                  }
                />
              </Link>
              <div className="card-footer">
                <div className="card-action" role="cart-action">
                  <Dropdown
                    onVisibleChange={visible => {
                      if (visible) {
                        setVisibleBoardMenu(item.id);
                      } else {
                        setVisibleBoardMenu('');
                      }
                    }}
                    overlay={
                      <Menu>
                        <Menu.Item key="0">
                          <Link
                            to={{
                              pathname: `/board/${item.id}`,
                              state: { orgId: props.orgId },
                            }}
                          >
                            Edit
                          </Link>
                        </Menu.Item>
                        <Menu.Item
                          role="rename-menu"
                          key="1"
                          onClick={() => handleClickRename(item.id)}
                        >
                          Rename
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          key="2"
                          role="delete-menu"
                          onClick={() => handleDeleteBoard(item.id)}
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

                {editBoardItem !== item.id && (
                  <div className="card-title">
                    {item.name}
                    {item && item.name && item.name.length >= 34 ? (
                      <span className="tooltip">{item.name}</span>
                    ) : (
                      ''
                    )}
                  </div>
                )}
                {editBoardItem === item.id && (
                  <div className="card-title-input">
                    <Input
                      addonAfter={
                        <>
                          {!loading && (
                            <SaveOutlined
                              onClick={onSaveName}
                              style={{ cursor: 'pointer' }}
                            />
                          )}

                          {loading && <LoadingOutlined />}
                        </>
                      }
                      defaultValue={item.name}
                      onChange={handleChangeName}
                    />
                  </div>
                )}
                <div className="card-timestamp">
                  {item && item.createdAt
                    ? moment(item.createdAt).format('LLL')
                    : ''}
                </div>
                <div className="card-users">
                  <span className="material-icons">group</span>
                  <Collaboration users={item.users} />
                </div>
              </div>
            </div>
          ))
        : !boardList.loading && (
            <h3
              style={{
                width: '100%',
                color: 'red',
                textAlign: 'center',
              }}
            >
              No Boards
            </h3>
          )}
    </div>
  );
};
