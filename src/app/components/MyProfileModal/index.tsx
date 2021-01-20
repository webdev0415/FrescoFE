import React, { Fragment, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, Row, Col } from 'antd';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { useDispatch, useSelector } from 'react-redux';
import { actions, reducer, sliceKey } from './slice';
import { updateProfileSaga } from './saga';
import ImgCrop from 'antd-img-crop';
import './styles.less';
import { selectToken } from 'app/selectors';
import { selectMyProfileModal } from './selectors';
import axios from 'axios';

export const MyProfileModal = ({
  onCancel,
  loading,
  useremail,
  onUpdateProfile,
}) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: updateProfileSaga });

  const [form] = Form.useForm();

  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [previewTitle, setPreviewTitle] = React.useState('');

  const initList: any[] = [];
  const [fileList, setFileList] = React.useState(initList);

  const token = useSelector(selectToken);
  const myProfileSelector = useSelector(selectMyProfileModal);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(
        actions.getProfileDataRequest({
          token,
        }),
      );
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (myProfileSelector?.myProfile) {
      const myProfile = myProfileSelector?.myProfile;
      form.setFieldsValue({
        firstname: myProfile.firstName,
        lastname: myProfile.lastName,
        email: myProfile.email,
        aboutme: myProfile.about,
      });
      if (myProfile.avatar) {
        const uploadedAvatarFile = {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: myProfile.avatar,
        };
        setFileList([uploadedAvatarFile]);
      } 
    }
  }, [form, myProfileSelector]);

  const handleOnCancel = () => {
    onCancel();
  };
  const handlePreviewCancel = () => setPreviewVisible(false);
  const onChange = ({ fileList: newFileList }) => {
    console.log("newFileList", newFileList)
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

  const onFinish = values => {
    dispatch(actions.updateProfileRequest({ data: values, token }));
    onUpdateProfile(values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const uploadAvatar = async ({ onSuccess, onError, file }) => {
    const fmData = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    fmData.append('file', file);
    try {
      const res = await axios.post(
        'https://frescobe.herokuapp.com/upload/image/avatar',
        fmData,
        config,
      );

      onSuccess('ok');
      form.setFieldsValue({
        avatar: res.data.path,
      });
    } catch (err) {
      onError({ err });
    }
  };

  return (
    <Fragment>
      <Modal visible={true} footer={null} onCancel={() => handleOnCancel()}>
        <div style={{ width: '90%', margin: 'auto' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Profile</p>
          <Form
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          >
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
                  name="lastname"
                  rules={[
                    { required: true, message: 'Please input your Last Name!' },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
              <Col xs={2} xl={2}></Col>
              <Col xs={5} xl={5}>
                <Form.Item name="avatar">
                  <ImgCrop shape="round" rotate>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={handlePreview}
                      customRequest={uploadAvatar}
                    >
                      {fileList.length < 1 && '+ Upload'}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
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
              <Button
                type="primary"
                htmlType="submit"
                loading={myProfileSelector.loading}
              >
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
