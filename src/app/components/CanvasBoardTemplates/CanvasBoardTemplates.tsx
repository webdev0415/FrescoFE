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
      <Tabs defaultActiveKey="1" className="canvas-board-template">
        <TabPane tab="Tab 1" key="1">
          <div className="card-section">
            <div className="card-grid">
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
            </div>
          </div>
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <div className="card-section">
            <div className="card-grid">
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
            </div>
          </div>
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          <div className="card-section">
            <div className="card-grid">
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
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
});
