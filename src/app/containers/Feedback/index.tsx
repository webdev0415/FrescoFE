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
              <p>
                Considering your experience using Fresco, how likely would you
                recommend our tool to a friend or colleague?
              </p>
              <div>
                <Radio.Group buttonStyle="solid" size="large">
                  <Space size="middle">
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={0}
                    >
                      0
                    </Radio.Button>

                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={1}
                    >
                      1
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={2}
                    >
                      2
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={3}
                    >
                      3
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={4}
                    >
                      4
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={5}
                    >
                      5
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={6}
                    >
                      6
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={7}
                    >
                      7
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={8}
                    >
                      8
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={9}
                    >
                      9
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        border: '1px solid blue',
                        padding: '0 25px 25px',
                        color: 'blue',
                      }}
                      value={10}
                    >
                      10
                    </Radio.Button>
                  </Space>
                </Radio.Group>
                <Row>
                  <Col span={10}>
                    <Text style={{ fontSize: '12px', marginLeft: '-220px' }}>
                      Very unlikely
                    </Text>
                  </Col>
                  <Col span={10}>
                    <Text style={{ fontSize: '12px', marginRight: '-530px' }}>
                      Very likely
                    </Text>
                  </Col>
                </Row>
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
