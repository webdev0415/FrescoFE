import React, { memo } from 'react';
import { Tabs, Row, Typography, Input, Spin, Col, Button, Form } from 'antd';
import styled from 'styled-components/macro';

import ItemBoard from 'app/components/ItemBoard';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import './styles.less';
import { useDispatch, useSelector } from 'react-redux';
import { selectBoard } from './selectors';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectBoardsSaga } from './saga';
import pageIcon from 'assets/icons/page.svg';
import { PlusOutlined } from '@ant-design/icons';
import { BarChartOutlined } from '@ant-design/icons';

import dashboardIcon from 'assets/icons/dashboard.svg';
import CanvasesList from 'app/components/CanvasesList';
import { BoardApiService } from 'services/APIService/BoardsApi.service';
import Auth from 'services/Auth';
import { Categories } from '../Categories';

const { TabPane } = Tabs;

const panes = [
  { tab: 'Customer Journey Maps', key: '1' },
  { tab: 'Innovation', key: '2' },
  { tab: 'Business modal', key: '3' },
  { tab: 'Product', key: '4' },
  { tab: 'Marketing', key: '5' },
];

interface Props extends RouteComponentProps<any> {}

export const SelectBoard = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: selectBoardsSaga });

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [form] = Form.useForm();

  const history = useHistory();

  const board = useSelector(selectBoard);
  const dispatch = useDispatch();

  const getCanvases = React.useCallback(() => {
    dispatch(actions.selectBoardRequest(props.match.params.id));
  }, [dispatch, props.match.params.id]);

  const handleCreateBoard = React.useCallback(
    (canvasData, canvasId) => {
      form
        .validateFields()
        .then(values => {
          form.resetFields();
          const data = {
            orgId: props.match.params.id,
            data: canvasData,
            name: values.name,
            createdUserId: Auth.getUser().id,
          };
          BoardApiService.create(data).subscribe(res => {
            history.push(`/create-board/${res.orgId}/${res.id}`);
          });
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    },
    [props.match.params.id, history, form],
  );

  React.useEffect(() => {
    getCanvases();
  }, [getCanvases]);
  return (
    <Div
      style={{
        width: '100%',
        // height: '80vh',
        background: '#ffffff',
      }}
      className="select-board"
    >
      <Tabs defaultActiveKey="1" tabPosition="left" className="left-sidebar">
        <TabPane tab={<img src={pageIcon} alt="page" />} key="1">
          <Wraper>
            <InputWrapper>
              <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
                style={{ display: 'flex' }}
              >
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the board name!',
                    },
                  ]}
                >
                  <Input placeholder="Board name" />
                </Form.Item>

                <Button
                  onClick={() => {
                    props.history.goBack();
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </Button>
              </Form>
            </InputWrapper>
          </Wraper>

          <Tabs
            defaultActiveKey={'1'}
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
          >
            {board.loading ? (
              <SpinnerDiv>
                <Spin />
              </SpinnerDiv>
            ) : (
              panes.map((pan, index) => (
                <TabPane tab={pan.tab} key={pan.key}>
                  <div style={{ height: '65vh', overflowX: 'hidden' }}>
                    {board.canvases.length ? (
                      <Row gutter={[16, 16]}>
                        {board.canvases.map(item => (
                          <ItemBoard
                            onCreateBoard={handleCreateBoard}
                            item={item}
                            key={item.id}
                          />
                        ))}
                      </Row>
                    ) : (
                      'No Canvases'
                    )}
                  </div>
                </TabPane>
              ))
            )}
          </Tabs>
        </TabPane>

        <TabPane tab={<img src={dashboardIcon} alt="dashboard" />} key="2">
          <CanvasesList orgId={props.match.params.id} />
        </TabPane>
        {Auth.getUser().role === 'ADMIN' && (
          <TabPane tab={<BarChartOutlined />} key="3">
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
              <h3 className="categories__tab-title">Categories</h3>
              <Categories
                visible={isModalOpen}
                onCancel={() => {
                  setModalOpen(false);
                }}
              />
            </div>
          </TabPane>
        )}
      </Tabs>
    </Div>
  );
});

const Div = styled.div``;

const InputWrapper = styled.div`
  max-width: 350px;
  margin-right: 16px;
`;

const Wraper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: white;
  padding-top: 2vh;
  padding-bottom: 2vh;
  padding-left: 24px;
`;

const SpinnerDiv = styled.div`
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
  width: 100%;
`;
