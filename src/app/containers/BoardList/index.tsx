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
