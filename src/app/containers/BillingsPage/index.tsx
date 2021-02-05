import React from 'react';
import { Card, Col, Row, Button, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import './styles.less';

export const BillingsPage = () => {
  const { Text } = Typography;

  return (
    <div className="billings-page-container">
      <Row className="billings-row" justify="center" gutter={16}>
        <Col className="billings-column" span={6}>
          <Card className="billings-card" bordered={false}>
            <div className="billings-card-title">Free</div>
            <div className="billings-card-description">
              Ideal solution for beginners
            </div>
            <div className="billings-card-price">
              <div className="billings-card-price-currency">$</div>
              <div className="billings-card-price-coast">0</div>
              <div className="billings-card-price-month">/mo</div>
            </div>
            <div className="billings-card-button-container">
              <Button type="primary" shape="round" size={'large'}>
                Add to cart
              </Button>
            </div>
            <div className="billings-card-offer-item">
              <CheckOutlined />
              <Text strong>Ant Design:</Text>
              <Text>Ant Design</Text>
            </div>
          </Card>
        </Col>
        <Col className="billings-column" span={6}>
          <Card className="billings-card" bordered={false}>
            <div className="billings-card-title">Premium</div>
            <div className="billings-card-description">Card Description</div>
            <div className="billings-card-price">
              <div className="billings-card-price-currency">$</div>
              <div className="billings-card-price-coast">0</div>
              <div className="billings-card-price-month">/mo</div>
            </div>
            <div className="billings-card-button-container">
              <Button type="primary" shape="round" size={'large'}>
                Add to cart
              </Button>
            </div>

            <div className="billings-card-offer-item">
              <CheckOutlined />
              <Text strong>Ant Design:</Text>
              <Text>Ant Design</Text>
            </div>
          </Card>
        </Col>
        <Col className="billings-column" span={6}>
          <Card className="billings-card" bordered={false}>
            <div className="billings-card-title">Gold</div>
            <div className="billings-card-description">
              Ideal solution for beginners
            </div>
            <div className="billings-card-price">
              <div className="billings-card-price-currency">$</div>
              <div className="billings-card-price-coast">0</div>
              <div className="billings-card-price-month">/mo</div>
            </div>
            <div className="billings-card-button-container">
              <Button type="primary" shape="round" size={'large'}>
                Add to cart
              </Button>
            </div>

            <div className="billings-card-offer-item">
              <CheckOutlined />
              <Text strong>Ant Design:</Text>
              <Text>Ant Design</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
