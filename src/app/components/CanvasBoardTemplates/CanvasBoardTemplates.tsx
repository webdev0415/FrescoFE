import React, { memo, MouseEvent } from 'react';
import { Button, Tabs, Input, Dropdown, Menu } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

interface Props {
  onClose(event: MouseEvent);
}

export const CanvasBoardTemplates = memo((props: Props) => {
  return (
    <div className="create-board-view">
      <div className="form-view">
        <Input placeholder="Board Name" />
        <Button type="default" icon={<CloseOutlined />} onClick={props.onClose}>
          Cancel
        </Button>
      </div>
      <Tabs className="canvas-board-template">
        <TabPane tab="Business model" key="1">
          <div className="card-section">
            <div className="card-grid">
              {new Array(5).fill(0).map((item, index) => (
                <div className="cards-board card-board-select" key={index}>
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                  <div className="card-footer card-board-footer">
                    <div className="card-title">Business Model</div>
                    <div className="card-description">
                      Use this template to create a shared understanding of
                      customer aspirations and priorities{' '}
                    </div>
                    <div className="card-board-action">
                      <Button type="primary">Select</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPane>
        <TabPane tab="Marketing" key="2">
          <div className="card-section">
            <div className="card-grid">
              {new Array(5).fill(0).map((item, index) => (
                <div className="cards-board card-board-select" key={index}>
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                  <div className="card-footer card-board-footer">
                    <div className="card-title">Marketing</div>
                    <div className="card-description">
                      Use this template to create a shared understanding of
                      customer aspirations and priorities{' '}
                    </div>
                    <div className="card-board-action">
                      <Button type="primary">Select</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPane>
        <TabPane tab="Innovation" key="3">
          <div className="card-section">
            <div className="card-grid">
              {new Array(5).fill(0).map((item, index) => (
                <div className="cards-board card-board-select" key={index}>
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                  <div className="card-footer card-board-footer">
                    <div className="card-title">Innovation</div>
                    <div className="card-description">
                      Use this template to create a shared understanding of
                      customer aspirations and priorities{' '}
                    </div>
                    <div className="card-board-action">
                      <Button type="primary">Select</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
});
