import React from 'react';
import { Radio, Row, Col, Space, Typography, Layout, Card } from 'antd';

const FeedBack = () => {
  const { Text, Title } = Typography;
  const { Header } = Layout;

  return (
    <div>
      <Header style={{ backgroundColor: '#fff', height: '65px' }}>
        <Row justify="space-between">
          <Col span={4}>
            <Title
              level={3}
              style={{ color: 'blue', fontSize: '38px', paddingLeft: '40px' }}
            >
              Feedback
            </Title>
          </Col>
          <Col span={4}>icon</Col>
        </Row>
      </Header>

      <Row style={{ marginTop: '40px' }}>
        <Col span={3}></Col>
        <Col span={18}>
          <div className="site-card-border-less-wrapper">
            <Card
              style={{ paddingTop: '300px', textAlign: 'center' }}
              bordered={true}
            >
              <div style={{ paddingBottom: '64px' }}>
                <p style={{ fontSize: '16px' }}>
                  Considering your <i>experience</i> using Fresco, how likely
                  would you recommend our tool to a friend or colleague?
                </p>
                <div>
                  <Radio.Group buttonStyle="solid" size="large">
                    <Space size="small">
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={0}
                      >
                        0
                      </Radio.Button>

                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={1}
                      >
                        1
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={2}
                      >
                        2
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={3}
                      >
                        3
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={4}
                      >
                        4
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={5}
                      >
                        5
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={6}
                      >
                        6
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={7}
                      >
                        7
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={8}
                      >
                        8
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={9}
                      >
                        9
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          border: '1px solid #6b91f6',
                          padding: '0 20px 40px',
                          color: '#6b91f6',
                        }}
                        value={10}
                      >
                        10
                      </Radio.Button>
                    </Space>
                  </Radio.Group>
                  <Row>
                    <Col span={10}>
                      <Text
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          marginLeft: '-20px',
                        }}
                      >
                        Very Unlikely
                      </Text>
                    </Col>
                    <Col span={10}>
                      <Text
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          marginRight: '-355px',
                        }}
                      >
                        Very Likely
                      </Text>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={3}></Col>
      </Row>
    </div>
  );
};

export default FeedBack;
