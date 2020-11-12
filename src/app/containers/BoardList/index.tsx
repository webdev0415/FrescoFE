import { Card, Col, Row, Typography } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { boardListSaga } from './saga';
import { actions, reducer, sliceKey } from './slice';
import { selectBoardList } from './selectors';

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

  return (
    <Row gutter={20}>
      {boardList.boardList.length ? (
        boardList.boardList.map(item => (
          <Col key={item.id} span={6}>
            <Card
              style={{ marginTop: 20 }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              // actions={['Journey Ideas', <EllipsisOutlined key="ellipsis" />]}
            />
          </Col>
        ))
      ) : (
        <Typography.Title level={5}>No Boards</Typography.Title>
      )}
    </Row>
  );
};

{
  /* <div className="card-grid">
              {new Array(5).fill(0).map((item, index) => (
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
                              <a href="http://www.alipay.com/">1st menu item</a>
                            </Menu.Item>
                            <Menu.Item key="1">
                              <a href="http://www.taobao.com/">2nd menu item</a>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="3">3rd menu item</Menu.Item>
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
                      <span className="user-title">
                        Anup Surendan, JJ and 5+ collaborating
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div> */
}
