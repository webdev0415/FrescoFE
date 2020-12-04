import { Card, Col, Dropdown, Menu, Row, Skeleton, Typography } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { boardListSaga } from './saga';
import { actions, reducer, sliceKey } from './slice';
import { selectBoardList } from './selectors';
import { Link } from 'react-router-dom';
import { BoardApiService } from 'services/APIService/BoardsApi.service';

interface BoardListProps {
  orgId: string;
}

export const BoardList = (props: BoardListProps) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: boardListSaga });

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

  return (
    <div className="card-grid">
      {boardList.loading &&
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
            <div className="cards-board" key={index}>
              <Link
                to={{
                  pathname: `/canvas/${item.id}/board`,
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
                <div className="card-action">
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="0">
                          <Link
                            to={{
                              pathname: `/canvas/${item.id}/board`,
                              state: { orgId: props.orgId },
                            }}
                          >
                            Edit
                          </Link>
                        </Menu.Item>
                        <Menu.Item key="1">
                          <a href="http://www.taobao.com/">Action</a>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          key="3"
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
                <div className="card-title">QuestionPro Journey Map</div>
                <div className="card-timestamp">Opened Oct 12, 2020</div>
                <div className="card-users">
                  <span className="material-icons">group</span>
                  <span className="user-title">{item.name}</span>
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
