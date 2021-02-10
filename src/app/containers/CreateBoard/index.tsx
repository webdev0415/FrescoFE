import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
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
import { Link } from 'react-router-dom';
import DrawBoard from 'app/components/DrawBoard/DrawBoard';
import { ShareModal } from 'app/components/ShareModal';
import { CollaboratorModal } from 'app/components/CollaboratorModal';
import { PERMISSION } from '../Dashboard';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken, selectUser } from 'app/selectors';
import { invitationType } from 'utils/constant';
import { Chat } from 'app/components/Chat/Chat';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';
import socketIOClient from 'socket.io-client';
import { connect } from 'react-redux';
import {
  CollaboratorInterface,
  collaboratorsService,
} from '../../../services/CollaboratorsService';
import { BoardApiService } from '../../../services/APIService/BoardApi.service';

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
    const [collaborators, setCollaborators] = useState<CollaboratorInterface[]>(
      [],
    );
    const [chatMessages, setChatMessages] = useState<any>([]);
    const location = useLocation();
    const orgId = (location.state as IState)?.orgId;
    const token = useSelector(selectToken);
    const boardId = props?.match?.params?.id;
    const [messagesOffset, setMessagesOffset] = useState(0);
    const [newMessageBucket, setNewMessageBucket] = useState(null);
    const messagesLimit = 25;
    const [socketClient, setSocketClient] = useState<any>(null);
    const [messagesOnLoad, setMessagesOnLoad] = useState<Boolean>(false);
    const [chatNotification, setChatNotification] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [board, setBoard] = useState<any>(null);

    const user = useSelector(selectUser);

    useEffect(() => {
      collaboratorsService.state.subscribe(value => {
        setCollaborators(value);
      });
      BoardApiService.state.subscribe(value => {
        setBoard(value);
      });
    }, []);

    useEffect(() => {
      const url = new URL(process.env.REACT_APP_BASE_URL as string);
      url.pathname = 'board';
      const client = socketIOClient(url.href, {
        transports: ['websocket'],
        query: {
          token: props.token,
        },
      });
      setSocketClient(client);

      if (!Array.isArray(user) && user) {
        client.on('createMessage', data => {
          if (data.sender.id !== user.id) {
            //console.log(chatModal, 'chatModal');
            setChatMessages(messages => {
              // setNewMessageIcon(true);
              // setChatNotification(true);
              if (data.sender.id !== user.id) {
                return {
                  ...messages,
                  messages: [data, ...messages.messages],
                };
              }
              // if (!chatModal) {
              //   setChatNotification(true);
              // } else {
              //
              // }
              // return messages;
            });
          }
        });

        client.on('updateMessage', data =>
          setChatMessages(messages => {
            return {
              ...messages,
              messages: messages.messages.map(message => {
                if (message.id === data.id) {
                  return data;
                }
                return message;
              }),
            };
          }),
        );

        client.on('deleteMessage', data =>
          setChatMessages(messages => {
            return {
              ...messages,
              messages: messages.messages.filter(
                message => message.id !== data.id,
              ),
            };
          }),
        );
      }
    }, [props.token, user]);

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
    }, [boardId, chatMessages.length, messagesOffset]);

    useEffect(() => {
      setMessagesOnLoad(true);
      setLoadingMessages(true);
      MessagesApiService.AllMessages(
        boardId,
        messagesOffset,
        messagesLimit,
      ).subscribe(data => {
        setMessagesOnLoad(false);
        setNewMessageBucket(data.messages);
        setLoadingMessages(false);
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
      setShowInputTitle(false);
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

      setImmediate(() => {
        const canvasTitle = document.getElementById(
          'canvas-title',
        ) as HTMLDivElement;
        canvasTitle.innerText = canvasTitleInput.value || '';
      });
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
      setIsShowShareModal(false);
    };

    let appUrl = '/organization/' + orgId;
    if (board !== null && board.teamId) {
      appUrl = `/organization/${orgId}/team/${board.teamId}`;
    }

    const openChatModal = () => {
      if (!chatModal) {
        setMessagesOnLoad(true);
        setChatModal(true);
        setChatNotification(false);
        setIsShowShareModal(false);
        setCollaboratorModal(false);
        MessagesApiService.AllMessages(boardId, 0, messagesLimit).subscribe(
          data => {
            setMessagesOnLoad(false);
            setChatMessages(data);
          },
        );
      } else {
        setChatModal(false);
      }
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
              loadingMessages={loadingMessages}
            />
          )}

          {collaboratorModal && <CollaboratorModal closeModal={_closeModal} />}

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
              onZoom={level => {
                setZoom(level);
              }}
              {...props}
            />
          )}
          <div className="canvas-header">
            <div className="canvas-header-left">
              <Link to={appUrl} className="canvas-header-logo">
                <img src={logoImg} style={{ color: '#9646f5' }} alt="logo" />
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
                  onBlur={handleKeyDown}
                />
              )}
              <div className="canvas-header-actions">
                <div className="canvas-header-action-item" id="undo-history">
                  <UndoIcon style={{ color: '#9646f5' }} />
                </div>
                <div className="canvas-header-action-item" id="redo-history">
                  <RedoIcon style={{ color: '#9646f5' }} />
                </div>
              </div>
            </div>
            <div className="canvas-header-right">
              <div className="canvas-collaborators">
                {collaborators.length > 3 && (
                  <div className="oval count">+{collaborators.length - 3}</div>
                )}
                {collaborators.slice(0, 3).map(item => (
                  <div className="oval">
                    {item.email.slice(0, 2).toUpperCase()}
                  </div>
                ))}
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
                  onClick={() => openChatModal()}
                  className={clsx('canvas-header-action-item', {
                    active: chatModal,
                  })}
                >
                  <span
                    className={`chat-notification ${
                      chatNotification ? 'active' : ''
                    }`}
                  ></span>
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
          <div>
            <Link to="/Feedback">
              <Button className="feedback-btn">Share Feedback</Button>
            </Link>
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
