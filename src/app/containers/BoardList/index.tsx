import { Card, Col, Dropdown, Menu, Row, Typography } from 'antd';
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
      {boardList.boardList.length ? (
        boardList.boardList.map((item, index) => (
          <div className="cards-board" key={index}>
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            <div className="card-footer">
              <div className="card-action">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <Link to={`/create-board/${item.orgId}/${item.id}`}>
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
      ) : (
        <Typography.Title style={{ marginLeft: 10 }}>
          No Boards
        </Typography.Title>
      )}
    </div>
  );
};
