import React, { memo } from 'react';
import { Button, Tabs, Row } from 'antd';
import styled from 'styled-components/macro';
import {
  BookOutlined,
  AppstoreOutlined,
  CloseOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ItemBoard from 'app/components/ItemBoard';

const { TabPane } = Tabs;

const panes = [
  { tab: 'Customer Journey Maps', key: '1' },
  { tab: 'Innovation', key: '2' },
  { tab: 'Business modal', key: '3' },
  { tab: 'Product', key: '4' },
  { tab: 'Marketing', key: '5' },
];

interface Props {}

export const SelectBoard = memo((props: Props) => {
  return (
    <Div
      style={{
        width: '100%',
        height: 'auto',
      }}
    >
      <Tabs
        hideAdd
        type={'card'}
        tabPosition={'left'}
        tabBarStyle={{ height: '80vh', width: 50, backgroundColor: '#B3B6B7' }}
      >
        <TabPane
          tab={
            <BookOutlined
              style={{ height: 40, fontSize: '1rem', textAlign: 'center' }}
            />
          }
          key="1"
          style={{ width: '100%', height: 'auto', paddingLeft: 0 }}
        >
          <Wraper>
            <DivFlexEnd>
              <UserOutlined style={{ fontSize: '2rem' }} />
            </DivFlexEnd>

            <Button icon={<CloseOutlined style={{}} />} style={{ height: 40 }}>
              Cancel
            </Button>
          </Wraper>

          <Tabs
            defaultActiveKey={'1'}
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
          >
            {panes.map((pan, index) => (
              <TabPane tab={pan.tab} key={pan.key}>
                <div>
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

const Wraper = styled.div`
  justify-content: center;
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
