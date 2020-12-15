import React, { memo, useEffect, useState } from 'react';
import { RouteChildrenProps, useLocation } from 'react-router';
import logoImg from 'assets/icons/logo-color.svg';
import { ChatIcon, GroupIcon, ShareIcon } from 'assets/icons';
import { v4 as uuidv4 } from 'uuid';

import { Button, Slider } from 'antd';
import {
  RedoIcon,
  UndoIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '../../components/CanvasIcons';
import clsx from 'clsx';
import { Link, useHistory } from 'react-router-dom';
import DrawBoard from 'app/components/DrawBoard/DrawBoard';
import { ShareModal } from 'app/components/ShareModal';
import { CollaboratorModal } from 'app/components/CollaboratorModal';
import { PERMISSION } from '../Dashboard';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from 'app/selectors';
import { invitationType } from 'utils/constant';
import { Chat } from 'app/components/Chat/Chat';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';
import socketIOClient from 'socket.io-client';
import { connect } from 'react-redux';

interface IState {
  orgId?: any;
}

export const CreateBoard = connect(({ global: { token } }: any) => ({ token }))(
  (props: any) => {
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
    const [showInputTitle, setShowInputTitle] = useState<boolean>(false);
    const [title, setTitle] = useState<string | null>('');
    const [permission, setPermission] = useState(PERMISSION.EDITOR);
    const [linkInvitation, setLinkInvitation] = useState(Object);
    const [chatModal, setChatModal] = useState(false);
    const [collaboratorModal, setCollaboratorModal] = useState(false);
    const [chatMessages, setChatMessages] = useState<any>([]);
    const history = useHistory();
    const location = useLocation();
    const orgId = (location.state as IState)?.orgId;
    const token = useSelector(selectToken);
    const boardId = props?.match?.params?.id;
    const [user, SetUser] = useState([]);
    const [messagesOffset, setMessagesOffset] = useState(0);
    const [newMessageBucket, setNewMessageBucket] = useState(null);
    const messagesLimit = 25;
    const [socketClient, setSocketClient] = useState<any>(null);
    const [messagesOnLoad, setMessagesOnLoad] = useState<Boolean>(false);

    useEffect(() => {
      const url = new URL(process.env.REACT_APP_BASE_URL as string);
      url.pathname = 'board';
      setSocketClient(
        socketIOClient(url.href, {
          transports: ['websocket'],
          query: {
            token: props.token,
          },
        }),
      );
    }, [props.token]);

    useEffect(() => {
      if (!chatModal) {
        setMessagesOffset(0);
        setChatMessages([]);
      }
    }, [chatModal]);

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
      Axios.request({
        method: 'GET',
        url: process.env.REACT_APP_BASE_URL + 'auth/me',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(response => {
        SetUser(response.data);
      });
    }, [token]);

    useEffect(() => {
      const collaboratorIcon = document.getElementById(
        'collaborator-icon',
      ) as HTMLDivElement;
      if (collaboratorIcon) {
        collaboratorIcon.addEventListener('click', () => {
          setCollaboratorModal(true);
          setChatModal(false);
          setIsShowShareModal(false);
        });
      }
      const shareIcon = document.getElementById(
        'share-icon-header',
      ) as HTMLDivElement;
      if (shareIcon) {
        shareIcon.addEventListener('click', () => {
          setIsShowShareModal(true);
          setChatModal(false);
          setCollaboratorModal(false);
        });
      }

      const chatIcon = document.getElementById('chat-icon') as HTMLDivElement;
      if (chatIcon) {
        setMessagesOnLoad(true);
        chatIcon.addEventListener('click', () => {
          setChatModal(true);
          setIsShowShareModal(false);
          setCollaboratorModal(false);
          MessagesApiService.AllMessages(
            boardId,
            messagesOffset,
            messagesLimit,
          ).subscribe(data => {
            setMessagesOnLoad(false);
            setChatMessages(data);
          });
        });
      }
    }, [boardId, messagesOffset]);

    useEffect(() => {
      setMessagesOnLoad(true);
      MessagesApiService.AllMessages(
        boardId,
        messagesOffset,
        messagesLimit,
      ).subscribe(data => {
        setMessagesOnLoad(false);
        setNewMessageBucket(data.messages);
        setChatMessages(prevState => {
          return {
            ...prevState,
            messages: [...(prevState.messages || []), ...data.messages],
          };
        });
      });
    }, [boardId, messagesOffset]);

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
      setCollaboratorModal(false);
    };

    const handleKeyDown = async event => {
      if (event.key === 'Enter') {
        const canvasTitleInput = document.getElementById(
          'canvas-title-input',
        ) as HTMLInputElement;
        setTitle(canvasTitleInput.value);
        const objState = props.location.state as any;
        await Axios.request({
          method: 'PUT',
          url: `${process.env.REACT_APP_BASE_URL}board/${boardId}`,
          data: {
            name: canvasTitleInput.value,
            orgId: objState.orgId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShowInputTitle(false);
        setImmediate(() => {
          const canvasTitle = document.getElementById(
            'canvas-title',
          ) as HTMLDivElement;
          canvasTitle.innerText = canvasTitleInput.value || '';
        });
      }
    };

    const handleDoubleClick = _event => {
      const canvasTitle = document.getElementById(
        'canvas-title',
      ) as HTMLDivElement;
      setShowInputTitle(true);
      setImmediate(() => {
        const canvasTitleInput = document.getElementById(
          'canvas-title-input',
        ) as HTMLInputElement;
        canvasTitleInput.value = canvasTitle.textContent || '';
        setTitle(canvasTitle.textContent);
      });
    };

    const hideChat = () => {
      setChatModal(false);
    };

    return (
      <div className="canvas-view">
        <div className="canvas-editor">
          {socketClient && (
            <Chat
              socketIoClient={socketClient}
              messagesOffset={messagesOffset}
              setChatMessages={setChatMessages}
              open={chatModal}
              hide={hideChat}
              boardId={boardId}
              messages={chatMessages}
              messagesOnLoad={messagesOnLoad}
              user={user}
              setMessagesOffset={setMessagesOffset}
              newMessagesBucket={newMessageBucket}
            />
          )}

          {collaboratorModal && (
            <CollaboratorModal
              closeModal={_closeModal}
              collaborator={[
                { id: uuidv4(), name: 'Jose', count: 43, color: '#4253AF' },
                { id: uuidv4(), name: 'Abe Baz', count: 13, color: '#97C05C' },
                {
                  id: uuidv4(),
                  name: 'Chuck Norris',
                  count: 19,
                  color: '#FE3834',
                },
                {
                  id: uuidv4(),
                  name: 'Clark Kent',
                  count: 26,
                  color: '#FFB830',
                },
              ]}
            />
          )}

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
          {socketClient && (
            <DrawBoard
              socketIoClient={socketClient}
              className="canvas-body"
              drawingTool={drawingTool}
              zoomLevel={zoom / 100 + 1}
              title={title}
              {...props}
            />
          )}
          <div className="canvas-header">
            <div className="canvas-header-left">
              <Link
                to={`/organization/${orgId}`}
                className="canvas-header-logo"
              >
                <img src={logoImg} alt="logo" />
              </Link>
              {!showInputTitle ? (
                <div
                  onDoubleClick={handleDoubleClick}
                  className="canvas-header-title"
                  id="canvas-title"
                />
              ) : (
                <input
                  type="text"
                  id="canvas-title-input"
                  className="canvas-title-input"
                  onKeyDown={handleKeyDown}
                />
              )}
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
              <div className="canvas-collaborators">
                <div className="oval">jj</div>
                <div className="oval">AS</div>
                <div className="oval">AB</div>
              </div>

              <div className="canvas-header-actions">
                <Button
                  id="collaborator-icon"
                  className={clsx('canvas-header-action-item', {
                    active: collaboratorModal,
                  })}
                >
                  <GroupIcon />
                </Button>
                <Button
                  id="chat-icon"
                  className={clsx('canvas-header-action-item', {
                    active: chatModal,
                  })}
                >
                  <ChatIcon />
                </Button>
                <Button
                  id="share-icon-header"
                  className={clsx('canvas-header-action-item', {
                    active: isShowShareModal,
                  })}
                >
                  <ShareIcon />
                </Button>
              </div>
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
