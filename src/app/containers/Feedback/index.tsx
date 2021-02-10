import React from 'react';
import { Radio, Row, Col, Card } from 'antd';

const FeedBack = () => {
  const radioStyles = {
    border: '1px solid #9646f5',
    padding: '1px 20px',
    color: '#9646f5',
  };

  return (
    <div className="feedback-container">
      <Row justify="space-around" className="feedback-header">
        <Col>
          <h3 className="header-title">Feedback</h3>
        </Col>
        <Col className="icon">
          <p>icon</p>
        </Col>
      </Row>
      <Row justify="center">
        <Col
          xl={{ span: 18 }}
          lg={{ span: 18 }}
          md={{ span: 22 }}
          sm={{ span: 24 }}
          xs={{ span: 2 }}
          className="feedback-col"
        >
          <Card bordered={true} className="feedback-card">
            <Radio.Group buttonStyle="solid" className="radio-btn-group">
              <Row gutter={[8, 16]} justify="center" className="feedback-row">
                <Col
                  xl={{ span: 22, offset: 1 }}
                  lg={{ span: 22, offset: 1 }}
                  md={{ span: 22, offset: 1 }}
                  sm={{ span: 24 }}
                  xs={{ span: 24 }}
                >
                  <p style={{ fontSize: '18px', textAlign: 'center' }}>
                    Considering your <i>experience using</i> Fresco, how likely
                    would you be to recommend our tool to a friend or colleague?
                  </p>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={0}>
                    0
                  </Radio.Button>
                  <p className="feedback-text" style={{ fontSize: '9px' }}>
                    Very Unlikely
                  </p>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={1}>
                    1
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={2}>
                    2
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={3}>
                    3
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={4}>
                    4
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={5}>
                    5
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={6}>
                    6
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={7}>
                    7
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={8}>
                    8
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <Radio.Button style={radioStyles} value={9}>
                    9
                  </Radio.Button>
                </Col>
                <Col className="radio-button-col">
                  <div className="rating">
                    <Radio.Button style={radioStyles} value={10}>
                      10
                    </Radio.Button>
                    <p
                      className="feedback-text"
                      style={{ fontSize: '9px', marginLeft: '10px' }}
                    >
                      Very likely
                    </p>
                  </div>
                </Col>
              </Row>
            </Radio.Group>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FeedBack;
