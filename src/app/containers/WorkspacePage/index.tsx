import React, { Fragment } from 'react';
import { Modal, Form, Input, Button, Upload, Row, Col } from 'antd';

import ImgCrop from 'antd-img-crop';
import './styles.less';

export const WorkspacePage = () => {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [previewTitle, setPreviewTitle] = React.useState('');
  const initList = [];
  const [fileList, setFileList] = React.useState(initList);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
  };

  const handlePreviewCancel = () => setPreviewVisible(false);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <Fragment>
      <div className="container">
        <Form layout="vertical">
          <Row>
            <Col xs={18} xl={18}>
              <p style={{ marginBottom: 40 }}>
                Edit your workspace information
              </p>
              <Form.Item
                name="workspacename"
                rules={[
                  {
                    required: true,
                    message: 'Please input the workspace name!',
                  },
                ]}
              >
                <Input placeholder="Workspace Name" />
              </Form.Item>
              <Form.Item name="workspacedomain">
                <Input placeholder="Workspace Domain" />
              </Form.Item>
            </Col>
            <Col xs={1} xl={1}></Col>
            <Col xs={5} xl={5}>
              <p>Logo</p>
              <div style={{ textAlign: 'right' }}>
                <ImgCrop shape="round" rotate>
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={handlePreview}
                  >
                    {fileList.length < 1 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </div>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
        <div>
          <p>Delete Organization</p>
          <Row>
            <Col xs={17} xl={17}>
              <p style={{ color: '#b8b8b8' }}>
                Delete an organization is an irreversible action. You will not
                be able to retrieve any message or files. Please use this
                feature with caution.
              </p>
            </Col>
            <Col xs={2} xl={2}></Col>
            <Col xs={5} xl={5}>
              <div style={{ textAlign: 'right' }}>
                <Button
                  type="text"
                  danger
                  style={{ whiteSpace: 'normal', padding: 0 }}
                >
                  Delete Organization
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Fragment>
  );
};
