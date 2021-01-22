import React, { Fragment, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, Row, Col } from 'antd';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { useDispatch, useSelector } from 'react-redux';
import { actions, reducer, sliceKey } from './slice';
import { updateWorkspaceSaga } from './saga';
import { selectWorkspacePage } from './selectors';
import { selectToken } from 'app/selectors';
import axios from 'axios';

import ImgCrop from 'antd-img-crop';
import './styles.less';
import { useWorkspaceContext } from '../../../context/workspace';

export const WorkspacePage = () => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: updateWorkspaceSaga });
  const [form] = Form.useForm();

  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [previewTitle, setPreviewTitle] = React.useState('');
  const initList = [];
  const [fileList, setFileList] = React.useState<any>(initList);
  const { organization, setOrganization } = useWorkspaceContext();
  const token = useSelector(selectToken);
  const workspacePageSelector = useSelector(selectWorkspacePage);
  const dispatch = useDispatch();

  useEffect(() => {
    if (organization) {
      form.setFieldsValue({
        workspacename: organization.organizationName,
        workspacedomain: organization.organizationSlug,
      });
      if (organization.organizationAvatar) {
        const uploadedAvatarFile = {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: organization.organizationAvatar,
        };
        setFileList([uploadedAvatarFile]);
      }
    }
  }, [form, organization]);

  useEffect(() => {
    if (workspacePageSelector?.workspace) {
      const workspace = workspacePageSelector?.workspace;
      const updatedOrganization = {
        id: organization.id,
        orgId: organization.orgId,
        organizationAvatar: workspace.avatar,
        organizationName: workspace.name,
        organizationSlug: workspace.slug,
        permission: organization.permission,
        userId: organization.userId,
      };
      setOrganization(updatedOrganization);
    }
  }, [
    organization.id,
    organization.orgId,
    organization.permission,
    organization.userId,
    setOrganization,
    workspacePageSelector,
  ]);

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

  const onFinish = values => {
    dispatch(
      actions.updateWorkspaceRequest({
        data: values,
        token,
        orgId: organization.orgId,
      }),
    );
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const uploadImage = async ({ onSuccess, onError, file }) => {
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
        process.env.REACT_APP_BASE_URL + 'upload/image/avatar',
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
      <div className="container">
        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
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
                <Input
                  placeholder="Workspace Name"
                  defaultValue={organization.organizationName}
                />
              </Form.Item>
              <Form.Item name="workspacedomain">
                <Input
                  placeholder="Workspace Domain"
                  defaultValue={organization.organizationSlug}
                />
              </Form.Item>
            </Col>
            <Col xs={1} xl={1}></Col>
            <Col xs={5} xl={5}>
              <p>Logo</p>
              <Form.Item name="avatar" style={{ textAlign: 'right' }}>
                <ImgCrop shape="round" rotate>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={handlePreview}
                    customRequest={uploadImage}
                  >
                    {fileList.length < 1 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Form.Item>
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
