import React, { memo } from 'react';
import { Button, Tabs, Row, Typography, Input } from 'antd';
import styled from 'styled-components/macro';
import {
  BookOutlined,
  AppstoreOutlined,
  CloseOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ItemBoard from 'app/components/ItemBoard';
import { RouteComponentProps } from 'react-router-dom';

import './styles.less';

const { TabPane } = Tabs;
const { Title } = Typography;

const panes = [
  { tab: 'Customer Journey Maps', key: '1' },
  { tab: 'Innovation', key: '2' },
  { tab: 'Business modal', key: '3' },
  { tab: 'Product', key: '4' },
  { tab: 'Marketing', key: '5' },
];

interface Props extends RouteComponentProps<any> {}

export const SelectBoard = memo((props: Props) => {
  return (
    <Div
      style={{
        width: '100%',
        height: '80vh',
        background: '#ffffff',
      }}
      className="select-board"
    >
      <Tabs
        hideAdd
        type={'card'}
        tabPosition={'left'}
        tabBarStyle={{ height: '(80vh)', backgroundColor: '#B3B6B7' }}
      >
        <TabPane
          tab={
            <BookOutlined
              style={{ height: 40, fontSize: '1rem', textAlign: 'center' }}
            />
          }
          key="1"
          style={{ width: '100%', height: '80vh', paddingLeft: 0 }}
        >
          <Wraper>
            <InputWrapper>
              <Input placeholder="Board Name" />
            </InputWrapper>
            <Div
              onClick={() => {
                props.history.goBack();
              }}
            >
              <Title
                level={5}
                style={{
                  height: 40,
                  color: '#9646F5',
                  cursor: 'pointer',
                  fontWeight: 300,
                  fontStyle: 'normal',
                  margin: 0,
                }}
              >
                Cancel
              </Title>
            </Div>
          </Wraper>

          <Tabs
            defaultActiveKey={'1'}
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
          >
            {panes.map((pan, index) => (
              <TabPane tab={pan.tab} key={pan.key}>
                <div style={{ height: '65vh', overflowX: 'hidden' }}>
                  {[1, 2, 3, 4, 5].map(item => (
                    <Row gutter={[16, 16]}>
                      {[1, 2, 3, 4].map(i => (
                        <ItemBoard item={item} key={i} i={i} index={index} />
                      ))}
                    </Row>
                  ))}
                </div>
              </TabPane>
            ))}
          </Tabs>
        </TabPane>

        <TabPane
          tab={<AppstoreOutlined style={{ height: 40 }} />}
          key="2"
          style={{ width: '100%', height: '80vh', backgroundColor: 'none' }}
        >
          Tab 2
        </TabPane>
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

const DivFlexEnd = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 20px;
`;
