import React, { Fragment } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Row,
  Col,
  Select,
  AutoComplete,
} from 'antd';
import { PERMISSION } from 'app/containers/Dashboard';
import ImgCrop from 'antd-img-crop';
import './styles.less';

let timer;

const { Option } = Select;

export const MyProfileModal = ({ onCancel, loading, useremail }) => {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [previewTitle, setPreviewTitle] = React.useState('');

  const initList = [];
  const [fileList, setFileList] = React.useState(initList);
  const handleOnCancel = () => {
    onCancel();
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
  // const onPreview = async file => {
  //   let src = file.url;
  //   if (!src) {
  //     src = await new Promise(resolve => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj);
  //       reader.onload = () => resolve(reader.result);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src);
  //   imgWindow.document.write(image.outerHTML);
  // };

  return (
    <Fragment>
      <Modal visible={true} footer={null} onCancel={() => handleOnCancel()}>
        <div style={{ width: '90%', margin: 'auto' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Profile</p>
          <Form layout="vertical">
            <Row style={{ alignItems: 'center', marginBottom: '24px' }}>
              <Col xs={8} xl={8} style={{ marginTop: '24px' }}>
                <Form.Item
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your First Name!',
                    },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col xs={1} xl={1}></Col>
              <Col xs={8} xl={8} style={{ marginTop: '24px' }}>
                <Form.Item
                  name="lasttname"
                  rules={[
                    { required: true, message: 'Please input your Last Name!' },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
              <Col xs={2} xl={2}></Col>
              <Col xs={5} xl={5}>
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
              </Col>
            </Row>
            <Row>
              <Col xs={17} xl={17}>
                <Form.Item label="Email" name="useremail">
                  <Input placeholder={useremail} disabled={true} />
                </Form.Item>
                <Form.Item label="About Me" name="aboutme">
                  <Input.TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col xs={7} xl={7}></Col>
            </Row>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
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
