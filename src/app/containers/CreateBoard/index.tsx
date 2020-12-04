import React, { memo, useEffect, useState } from 'react';
import { RouteChildrenProps, useLocation } from 'react-router';
import logoImg from 'assets/icons/logo-color.svg';
import chatIcon from 'assets/icons/chat.svg';
import { v4 as uuidv4 } from 'uuid';

import { Button, Dropdown, Input, Menu, Slider, Switch } from 'antd';
import {
  CheckOutlined,
  CopyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { DrawCanvas } from '../../components/DrawCanvas';
import {
  RedoIcon,
  UndoIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '../../components/CanvasIcons';
import clsx from 'clsx';
import pageIcon from '../../../assets/icons/page.svg';
import { useHistory } from 'react-router-dom';
import DrawBoard from 'app/components/DrawBoard/DrawBoard';
import { ShareModal } from 'app/components/ShareModal';
import { PERMISSION } from '../Dashboard';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from 'app/selectors';
import { invitationType } from 'utils/constant';
import { Chat } from 'app/components/Chat/Chat';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';

interface IState {
  orgId?: any;
}

export const CreateBoard = memo(
  (props: RouteChildrenProps<{ id: string; type: string }>) => {
    const [zoom, setZoom] = useState<number>(0);
    const [drawingTool, setDrawingTool] = useState<
      | 'Rect'
      | 'RectRounded'
      | 'Triangle'
      | 'Ellipse'
      | 'Star'
      | 'Text'
      | 'Sticky'
      | 'Line'
      | null
    >(null);
    const [showSubTools, setShowSubTools] = useState<string>('');
    const [isShowShareModal, setIsShowShareModal] = useState(false);
    const [chatModal, setChatModal] = useState(false);
    const [permission, setPermission] = useState(PERMISSION.EDITOR);
    const [linkInvitation, setLinkInvitation] = useState(Object);
    const history = useHistory();
    const location = useLocation();
    const orgId = (location.state as IState)?.orgId;
    const token = useSelector(selectToken);
    const boardId = props?.match?.params?.id;
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
      document.addEventListener('click', event => {
        const target = event.target as Node;
        const toolbar = document.getElementById(
          'canvas-toolbar',
        ) as HTMLDivElement;
        if (toolbar) {
          if (!toolbar.contains(target)) {
            setShowSubTools('');
          }
        }
      });
    }, []);

    useEffect(() => {
      const shareIcon = document.getElementById('share-icon') as HTMLDivElement;
      if (shareIcon) {
        shareIcon.addEventListener('click', () => {
          setIsShowShareModal(true);
        });
      }

      const chatIcon = document.getElementById('chat-icon') as HTMLDivElement;

      if (chatIcon) {
        chatIcon.addEventListener('click', () => {
          setChatModal(true);
          MessagesApiService.AllMessages(boardId).subscribe(data => {
            console.log('data', data);
            setChatMessages(data);
          });
        });
      }
    }, [boardId]);

    const _getLinkInvitation = async () => {
      try {
        let res;
        try {
          res = await Axios.request({
            method: 'GET',
            url: process.env.REACT_APP_BASE_URL + 'invitation-type',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              typeId: boardId,
              orgId: orgId,
              type: invitationType.BOARD,
            },
          });
        } catch (e) {
          console.log(e);
        }
        if (res?.data?.length) {
          setLinkInvitation(res.data[0]);
          setPermission(res?.data[0]?.permission);
        } else {
          const resCreated = await Axios.request({
            method: 'POST',
            url: process.env.REACT_APP_BASE_URL + 'invitation-type',
            data: {
              orgId: orgId,
              token: uuidv4(),
              permission: PERMISSION.EDITOR,
              type: invitationType.BOARD,
              typeId: boardId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setLinkInvitation(resCreated?.data);
          setPermission(resCreated?.data?.permission);
        }
      } catch (error) {
        console.error(error.response);
      }
    };

    useEffect(() => {
      if (boardId && token) {
        _getLinkInvitation();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardId, token]);

    const _onChangePermission = async e => {
      // console.log(e, linkInvitation);
      setPermission(e.key);
      const resUpdated = await Axios.request({
        method: 'PUT',
        url: `${process.env.REACT_APP_BASE_URL}invitation-type/${linkInvitation.id}/${invitationType.BOARD}`,
        data: {
          permission: e.key,
          type: invitationType.BOARD,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('resUpdated', resUpdated);
      setLinkInvitation(resUpdated?.data);
    };

    const _closeModal = () => {
      setIsShowShareModal(false);
    };

    const hideChat = () => {
      setChatModal(false);
    };

    return (
      <div className="canvas-view">
        <div className="canvas-editor">
          <Chat
            open={chatModal}
            hide={hideChat}
            boardId={boardId}
            messages={chatMessages}
          />
          {isShowShareModal && (
            <ShareModal
              permission={permission}
              onChangePermission={_onChangePermission}
              linkInvitation={linkInvitation}
              closeModal={_closeModal}
              orgId={orgId}
              typeId={boardId}
              type={invitationType.BOARD}
            />
          )}
          <DrawBoard
            className="canvas-body"
            drawingTool={drawingTool}
            zoomLevel={zoom / 100 + 1}
            {...props}
          />
          <div className="canvas-header">
            <div className="canvas-header-left">
              <div className="canvas-header-logo">
                <img src={logoImg} alt="logo" />
              </div>
              <div className="canvas-header-title" id="canvas-title">
                My Customer Journey
              </div>
              <div className="canvas-header-actions">
                <div className="canvas-header-action-item" id="undo-history">
                  <UndoIcon />
                </div>
                <div className="canvas-header-action-item" id="redo-history">
                  <RedoIcon />
                </div>
              </div>
            </div>
            <div className="canvas-header-right">
              <Dropdown.Button
                trigger={['click']}
                overlay={
                  <Menu className="canvas-dropdown">
                    <div className="dropdown-item">
                      <CheckOutlined /> Published
                    </div>
                    <div className="dropdown-item">
                      <img src={pageIcon} alt="page" /> Publish & Create Canvas
                    </div>
                    <div className="switch-item">
                      Public URL <Switch defaultChecked />
                    </div>
                    <div className="input-item">
                      <Input
                        addonAfter={<CopyOutlined />}
                        defaultValue="https://example.org"
                      />
                    </div>
                  </Menu>
                }
              >
                <span
                  id="save-canvas"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  Publish
                </span>
              </Dropdown.Button>
              <Button
                id="chat-icon"
                className={`${chatModal ? 'active' : ''}`}
                style={{ marginLeft: 16 }}
              >
                <img src={chatIcon} />
              </Button>
              <Button id="share-icon" style={{ marginRight: 16 }}>
                <ShareAltOutlined />
              </Button>
            </div>
          </div>

          <div className="canvas-footer">
            <div className="canvas-footer-actions">
              <div
                className="canvas-footer-action-item"
                onClick={() => {
                  if (zoom !== 0) {
                    setZoom(Math.max(zoom - 25, 0));
                  }
                }}
              >
                <ZoomOutIcon />
              </div>
              <div className="canvas-footer-action-slider">
                <Slider
                  value={zoom}
                  onChange={event => {
                    setZoom(event);
                  }}
                />
              </div>
              <div
                className="canvas-footer-action-item"
                onClick={() => {
                  if (zoom !== 100) {
                    setZoom(Math.min(zoom + 25, 100));
                  }
                }}
              >
                <ZoomInIcon />
              </div>
              <div className="canvas-footer-action-text">{zoom}%</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
