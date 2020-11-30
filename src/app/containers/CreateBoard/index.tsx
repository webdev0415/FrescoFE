import React, { memo, useEffect, useState } from 'react';
import { RouteChildrenProps, useLocation } from 'react-router';
import logoImg from 'assets/icons/logo-color.svg';
import { v4 as uuidv4 } from 'uuid';
import { GroupIcon, ChatIcon, ShareIcon } from 'assets/icons';

import { Dropdown, Input, Menu, Slider, Switch } from 'antd';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import {
  RedoIcon,
  UndoIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '../../components/CanvasIcons';
import pageIcon from '../../../assets/icons/page.svg';
import DrawBoard from 'app/components/DrawBoard/DrawBoard';
import { ShareModal } from 'app/components/ShareModal';
import { PERMISSION } from '../Dashboard';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from 'app/selectors';
import { invitationType } from 'utils/constant';

interface IState {
  orgId?: any;
}

export const CreateBoard = memo(
  (props: RouteChildrenProps<{ id: string; type: string }>) => {
    const [zoom, setZoom] = useState<number>(0);
    const [isShowShareModal, setIsShowShareModal] = useState(false);
    const [permission, setPermission] = useState(PERMISSION.EDITOR);
    const [linkInvitation, setLinkInvitation] = useState(Object);
    const location = useLocation();
    const orgId = (location.state as IState)?.orgId;
    const token = useSelector(selectToken);
    const boardId = props?.match?.params?.id;

    useEffect(() => {
      const shareIcon = document.getElementById('share-icon') as HTMLDivElement;
      if (shareIcon) {
        shareIcon.addEventListener('click', () => {
          setIsShowShareModal(true);
        });
      }
    }, []);

    const _getLinkInvitation = async () => {
      try {
        let res;
        try {
          res = await Axios.request({
            method: 'GET',
            url:
              process.env.REACT_APP_BASE_URL +
              `invitation-type/${boardId}/board-link`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (e) {
          console.log(e);
        }
        if (!res) {
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
        } else {
          setLinkInvitation(res.data);
          setPermission(res?.data?.permission);
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

    return (
      <div className="canvas-view">
        <div className="canvas-editor">
          {isShowShareModal && (
            <ShareModal
              permission={permission}
              onChangePermission={_onChangePermission}
              linkInvitation={linkInvitation}
              closeModal={_closeModal}
            />
          )}
          <DrawBoard
            className="canvas-body"
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
              <div className="canvas-collaborators">
                <div className="oval" style={{ zIndex: 100 }}>
                  jj
                </div>
                <div className="oval" style={{ zIndex: 99 }}>
                  AS
                </div>
                <div className="oval" style={{ zIndex: 98 }}>
                  AB
                </div>
              </div>
              <div className="canvas-header-actions">
                <div className="canvas-header-action-item">
                  <GroupIcon />
                </div>
                <div className="canvas-header-action-item">
                  <ChatIcon />
                </div>
                <div className="canvas-header-action-item" id="share-icon">
                  <ShareIcon />
                </div>
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
